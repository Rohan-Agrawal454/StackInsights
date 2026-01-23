# 🎯 How Personalization Works in Your Code

Complete flow from user behavior tracking to personalized content delivery.

---

## 📖 The Complete Flow (Step-by-Step)

```
User Visits → Profile Loads → Behavior Tracked → Attributes Calculated → 
Contentstack Matched → Variant Selected → Personalized Content Shown
```

---

## 1️⃣ **App Initialization** (`ProfileContext.tsx`)

### When: App loads or user switches profile

**File:** `src/contexts/ProfileContext.tsx`

```typescript
// Line 27-29: When profile is loaded
if (profile) {
  initializeUserAttributes(profile.id, profile.team);
}
```

**What happens:**
1. Fetches all authors from Contentstack
2. Loads saved profile from `localStorage` (or defaults to first author)
3. Calls `initializeUserAttributes()` to set up personalization

---

## 2️⃣ **Initialize Personalization** (`personalization.ts`)

### When: Profile loads or switches

**File:** `src/lib/personalization.ts` (Lines 165-187)

```typescript
export const initializeUserAttributes = (userId: string, team: string) => {
  const behavior = getUserBehavior(userId); // Load behavior from localStorage
  
  // Set team if not already set
  if (!behavior.team && team) {
    behavior.team = team;
    saveBehavior(behavior);
  }
  
  // Calculate attributes from behavior
  const attributes = {
    team: behavior.team || team,
    reading_frequency: calculateReadingFrequency(behavior),
    expertise_level: calculateExpertiseLevel(behavior),
    favorite_category: getFavoriteCategory(behavior),
  };
  
  // Sync to Contentstack Personalize
  setUserAttributes(userId, attributes);
  
  return attributes;
};
```

**What happens:**
1. Loads user's behavior from `localStorage` (key: `user_behavior_${userId}`)
2. Calculates derived attributes:
   - **reading_frequency**: Based on read count and last active time
   - **expertise_level**: Based on total posts read
   - **favorite_category**: Most viewed category (if ≥3 posts read)
3. Syncs attributes to Contentstack (for server-side matching)

**Stored Data Structure:**
```javascript
// localStorage key: user_behavior_user_1
{
  userId: "user_1",
  readCount: 5,
  categoryViews: {
    "Insight": 3,
    "Incident": 1,
    "Retrospective": 1
  },
  totalTimeSpent: 300,
  lastActive: 1737678000000,
  team: "Design",
  engineeringTeamPostsViewed: 0
}
```

---

## 3️⃣ **User Views a Post** (`PostDetail.tsx`)

### When: User clicks on a post

**File:** `src/pages/PostDetail.tsx` (Lines 36-38)

```typescript
// Track post view for personalization
if (fetchedPost && currentProfile) {
  trackPostView(currentProfile.id, fetchedPost, currentProfile.team);
}
```

**What happens:**
1. User opens a post detail page
2. `trackPostView()` is called automatically
3. Behavior data is updated:
   - `readCount++`
   - `categoryViews[post.category]++`
   - `lastActive = now()`
   - `engineeringTeamPostsViewed++` (if engineering team post)
4. Attributes are recalculated
5. Synced to Contentstack

**Example:**
```javascript
// User "Sarah" views 3rd Insight post
trackPostView("user_1", { category: "Insight", ... }, "Design");

// Behavior after tracking:
{
  readCount: 3,              // ← Incremented
  categoryViews: {
    "Insight": 3,            // ← Incremented
  },
  lastActive: 1737678123456, // ← Updated
  // ...
}

// Calculated attributes:
{
  reading_frequency: "occasional",      // < 2 posts per day
  expertise_level: "intermediate",      // 3-9 posts
  favorite_category: "Insight",         // ≥3 Insight posts ✅
}
```

**Key Logic:**
```typescript
// favorite_category only set after 3+ posts in same category
const getFavoriteCategory = (behavior) => {
  const sorted = Object.entries(behavior.categoryViews).sort((a, b) => b[1] - a[1]);
  
  if (sorted[0][1] >= 3) {   // ← Must read 3+ posts in category
    return sorted[0][0];      // Return category name
  }
  return '';                  // Empty = new user, no personalization
};
```

---

## 4️⃣ **Homepage Loads** (`Index.tsx`)

### When: User visits homepage

**File:** `src/pages/Index.tsx` (Lines 25-60)

```typescript
useEffect(() => {
  const loadHomepage = async () => {
    if (currentProfile) {
      const userAttrs = getUserAttributes(currentProfile.id);
      
      // Check if user has behavior (favorite category)
      if (userAttrs.favorite_category) {
        // ✅ User has behavior → fetch personalized homepage
        const personalizedData = await fetchPersonalizedHomepage(currentProfile.id, {
          team: currentProfile.team,
          reading_frequency: userAttrs.reading_frequency,
          expertise_level: userAttrs.expertise_level,
          favorite_category: userAttrs.favorite_category,
          is_engineering_team_reader: userAttrs.is_engineering_team_reader,
        });
        setHomepageData(personalizedData);
      } else {
        // ❌ No behavior yet → fetch default
        const defaultData = await fetchHomepage();
        setHomepageData(defaultData);
      }
    }
  };
  loadHomepage();
}, [currentProfile]);
```

**Decision Tree:**
```
Is favorite_category set?
├─ YES (≥3 posts in one category) → Call fetchPersonalizedHomepage()
└─ NO (new user) → Call fetchHomepage() (default content)
```

**Example Flow:**

**New User (Bob):**
```javascript
userAttrs = {
  favorite_category: "",  // ← Empty!
  reading_frequency: "occasional",
  expertise_level: "beginner"
}

// Result: Shows default homepage
```

**Experienced User (Sarah):**
```javascript
userAttrs = {
  favorite_category: "Insight",  // ← Has favorite!
  reading_frequency: "daily",
  expertise_level: "intermediate"
}

// Result: Fetches personalized homepage
```

---

## 5️⃣ **Fetch Personalized Content** (`contentstack-api.ts`)

### When: User has behavior data (favorite_category set)

**File:** `src/lib/contentstack-api.ts` (Lines 133-269)

### Step 5a: Initialize Personalize SDK

```typescript
// Line 154-156
const personalizeSdk = await Personalize.init(PERSONALIZE_PROJECT_UID, {
  userId: userId,  // e.g., "user_1"
});
```

**What happens:**
- Connects to Contentstack Personalize Edge API
- Identifies user by unique ID

### Step 5b: Send User Attributes

```typescript
// Lines 163-169
await personalizeSdk.set({
  team: "Design",
  reading_frequency: "daily",
  expertise_level: "intermediate",
  favorite_category: "Insight",
  is_engineering_team_reader: "false",
});
```

**What happens:**
- Sends attributes to Contentstack's edge network
- These attributes are used for audience matching

### Step 5c: Get Matched Variant

```typescript
// Lines 180-181
const experiences = personalizeSdk.getExperiences();
const variantAliases = personalizeSdk.getVariantAliases();
```

**What happens:**
- SDK automatically checks user attributes against **all audiences**
- Returns which variant (if any) the user matches

**Example Response:**
```javascript
// ✅ User matches "Insight Enthusiasts" audience
experiences = [
  {
    shortUid: "5",
    activeVariantShortUid: "0"  // ← Matched variant 0
  }
]

variantAliases = ["cs_personalize_5_0"]
```

**If no match:**
```javascript
// ❌ User attributes don't match any audience
experiences = [
  {
    shortUid: "5",
    activeVariantShortUid: null  // ← No match
  }
]

variantAliases = []  // ← Empty
```

### Step 5d: Fetch Variant Content from CMS

```typescript
// Lines 210-243
const defaultHomepage = await fetchHomepage();  // Get entry UID
const homepageUid = defaultHomepage.uid;        // e.g., "blta009adc402cfa96f"

const entryCall = Stack
  .contentType('rohan_homepage')
  .entry(homepageUid);

if (variantAliases && variantAliases.length > 0) {
  // ✅ Variant matched → fetch variant content
  const variantAliasString = variantAliases.join(',');  // "cs_personalize_5_0"
  personalizedEntry = await entryCall.variants(variantAliasString).fetch();
} else {
  // ❌ No variant → fetch default content
  personalizedEntry = await entryCall.fetch();
}
```

**What happens:**
1. Gets homepage entry UID
2. If variant matched: Calls `.variants("cs_personalize_5_0")`
3. Contentstack returns **variant content** instead of base content
4. If no match: Returns default content

**API Call:**
```
GET https://cdn.contentstack.io/v3/content_types/rohan_homepage/entries/blta009adc402cfa96f
    ?environment=dev
    &variants=cs_personalize_5_0  ← Key parameter!
```

### Step 5e: Track Impression

```typescript
// Lines 251-257
if (experiences.length > 0 && experiences[0].activeVariantShortUid) {
  await personalizeSdk.triggerImpression(experiences[0].shortUid);
}
```

**What happens:**
- Records that user saw this variant
- Data appears in Contentstack Analytics Dashboard
- Used for A/B testing and performance measurement

---

## 6️⃣ **Display Personalized Content** (`Index.tsx`)

### When: Personalized data is returned

**File:** `src/pages/Index.tsx` (Lines 74-95)

```typescript
// Extract content from personalized homepage
const heroTitle = homepageData.hero.title;
const heroTitleHighlight = homepageData.hero.title_highlight;
const heroSubtitle = homepageData.hero.subtitle;
const ctaTitle = homepageData.cta.title;
const ctaDescription = homepageData.cta.description;
// ... etc
```

**What renders:**
```jsx
<h1>
  {heroTitle} <span>{heroTitleHighlight}</span>
</h1>
<p>{heroSubtitle}</p>
```

**Example Output:**

**Default Homepage:**
```
Share Knowledge, Learn Together
Discover insights, incident reports, and retrospectives from teams...
```

**Personalized for Insight Enthusiasts:**
```
Discover Design Insights
Curated insights specifically for design professionals...
```

---

## 🔄 Complete Example: Sarah's Journey

### Day 1 - First Visit
```javascript
// 1. Sarah selects profile
Profile: Sarah (Design Team)

// 2. Initialize personalization
Behavior: { readCount: 0, categoryViews: {}, favorite_category: "" }
Attributes: { favorite_category: "", expertise_level: "beginner" }

// 3. Homepage loads
Condition: favorite_category is EMPTY
Result: Shows DEFAULT homepage ✅
Content: "Share Knowledge, Learn Together"
```

### Day 2 - Reads 3 Insight Posts
```javascript
// 1. Sarah views "Design System Best Practices"
trackPostView("user_2", { category: "Insight" }, "Design")
Behavior: { readCount: 1, categoryViews: { Insight: 1 } }

// 2. Sarah views "UX Research Methods"
trackPostView("user_2", { category: "Insight" }, "Design")
Behavior: { readCount: 2, categoryViews: { Insight: 2 } }

// 3. Sarah views "Accessibility Guidelines"
trackPostView("user_2", { category: "Insight" }, "Design")
Behavior: { readCount: 3, categoryViews: { Insight: 3 } }  // ← 3rd Insight post!

// 4. Attributes recalculated
Attributes: {
  favorite_category: "Insight",           // ← Now set!
  expertise_level: "intermediate",
  reading_frequency: "occasional"
}
```

### Day 3 - Homepage is Now Personalized
```javascript
// 1. Sarah visits homepage
Condition: favorite_category = "Insight" (not empty!)

// 2. fetchPersonalizedHomepage() is called
SDK.set({ favorite_category: "Insight", team: "Design", ... })

// 3. Contentstack matches audience
Audience: "Insight Enthusiasts"
Rules: favorite_category equals "Insight" AND team equals "Design"
Match: ✅ TRUE

// 4. Variant returned
variantAliases: ["cs_personalize_5_0"]

// 5. Fetch variant content
API: GET .../entries/blta009adc402cfa96f?variants=cs_personalize_5_0

// 6. Personalized content displayed
Result: Shows INSIGHT variant homepage ✅
Content: "Discover Design Insights"
        "Curated insights specifically for design professionals..."
```

---

## 🎯 Key Decision Points

### When Does Personalization Activate?

```typescript
// Line 33 in Index.tsx
if (userAttrs.favorite_category) {
  // ✅ Personalization ACTIVE
  fetchPersonalizedHomepage(...)
} else {
  // ❌ Personalization INACTIVE
  fetchHomepage()  // Default content
}
```

**Threshold:** User must read **3+ posts in same category**

### Why 3 Posts?

```typescript
// Line 100 in personalization.ts
if (sorted[0][1] >= 3) {  // ← Hardcoded threshold
  return sorted[0][0];     // Set favorite category
}
return '';                 // Keep empty (no personalization)
```

**Reasoning:**
- Ensures user has genuine interest (not just random browsing)
- Prevents premature personalization from 1-2 post views
- More accurate audience matching

---

## 🔧 How to Debug Your Setup

### 1. Check User Behavior (Browser Console)

```javascript
// In browser console
localStorage.getItem('user_behavior_user_1')

// Expected output:
{
  "readCount": 5,
  "categoryViews": { "Insight": 3, "Incident": 1, "Retrospective": 1 },
  "team": "Design",
  "favorite_category": "Insight"  // ← Must be set for personalization
}
```

### 2. Check Attributes Sent to Contentstack

Look for this log in console:
```
✅ User attributes set: {
  team: 'Design',
  reading_frequency: 'daily',
  expertise_level: 'intermediate',
  favorite_category: 'Insight',  // ← Must NOT be empty
  is_engineering_team_reader: 'false'
}
```

### 3. Check Variant Match

Look for this log:
```
✅ Experience 1 (shortUid: 5): Variant 0 matched
🎨 Variant Aliases: ['cs_personalize_5_0']
```

If you see:
```
⚠️ Experience 1 (shortUid: 5): No variant matched!
🎨 Variant Aliases: []
```

Then your user attributes don't match any audience rules in Contentstack!

### 4. Verify Contentstack Setup

**Check Audience Rules:**
- Go to Contentstack Personalize → Audiences
- Verify attribute keys match exactly: `favorite_category` (not `fav_cat`)
- Verify values match exactly: `"Insight"` (not `"insight"`)

**Check Experience:**
- Go to Contentstack Personalize → Experiences
- Ensure experience is **Published** and **Active**
- Ensure variants are assigned to audiences

---

## 📊 Summary Flow Diagram

```
┌─────────────────────┐
│   User Loads App    │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ ProfileContext.tsx  │  ← Initialize personalization
│ initializeUserAttrs()│     Load behavior from localStorage
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  User Views Posts   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  PostDetail.tsx     │  ← Track each view
│  trackPostView()    │     Update categoryViews
└──────────┬──────────┘     Increment readCount
           │
           ↓
┌─────────────────────┐
│ personalization.ts  │  ← Calculate attributes
│ getFavoriteCategory()│    If ≥3 posts → set favorite_category
└──────────┬──────────┘    Else → keep empty
           │
           ↓
┌─────────────────────┐
│    Index.tsx        │  ← Homepage loads
│ Check favorite_cat  │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
  EMPTY?    SET?
      │         │
      ↓         ↓
  ┌────────┐ ┌──────────────────┐
  │Default │ │fetchPersonalized │  ← Send to Contentstack
  │Content │ │  Homepage()      │     Match audiences
  └────────┘ └─────────┬────────┘     Get variant
                       │
                       ↓
              ┌────────────────┐
              │ Contentstack   │  ← Return variant content
              │ Personalize    │     or default if no match
              └────────┬───────┘
                       │
                       ↓
              ┌────────────────┐
              │ Display to     │  ← Personalized homepage!
              │ User           │
              └────────────────┘
```

---

## 💡 Key Takeaways

1. **Behavior Tracking**: Every post view updates `localStorage`
2. **Attribute Calculation**: Derived from behavior (read count, categories, etc.)
3. **Threshold**: 3+ posts in same category = personalization enabled
4. **SDK Integration**: Contentstack SDK handles audience matching automatically
5. **Content Delivery**: `.variants()` method fetches personalized content
6. **Analytics**: Impressions tracked for A/B testing

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Personalization not activating | `favorite_category` is empty | Read 3+ posts in same category |
| Variant not matching | Attribute keys don't match CMS | Use exact keys: `favorite_category` not `fav_cat` |
| API returns null variant | Audience rules don't match | Check attribute values (case-sensitive!) |
| Default content always shown | Experience not published | Publish experience in Contentstack |

---

Your personalization system is working! The key is:
1. ✅ User must read **3+ posts in same category** first
2. ✅ Then `favorite_category` gets set
3. ✅ Then personalization activates on next homepage visit

Test by viewing 3 Insight posts as one profile, then refresh the homepage! 🎉
