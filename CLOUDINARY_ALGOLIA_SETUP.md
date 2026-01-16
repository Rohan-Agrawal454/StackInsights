# Cloudinary + Algolia Integration Guide

Complete setup guide for adding image optimization and powerful search to StackInsights.

---

## 📸 Cloudinary Setup (Images)

### **Step 1: Create Cloudinary Account**

1. Sign up: https://cloudinary.com/users/register/free
2. Note your credentials:
   - **Cloud Name**: (e.g., `stackinsights`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (e.g., `abcdef1234567890`)

### **Step 2: Install in Contentstack**

1. **Contentstack** → **Marketplace** → Search **"Cloudinary"**
2. Click **Install**
3. Enter credentials from Step 1

### **Step 3: Add Featured Image Field**

Go to `rohan_post` content type, add:

**Field Settings:**
- Display Name: `Featured Image`
- UID: `featured_image`
- Data Type: `File`
- Enable: Cloudinary integration

### **Step 4: Add Environment Variables**

`.env.local`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### **Step 5: Update Content Types**

`src/types/contentstack.ts`:
```typescript
export interface ContentstackPost {
  // ... existing fields
  featured_image?: {
    url: string;
    filename: string;
    content_type: string;
  };
}
```

`src/lib/data.ts`:
```typescript
export interface Post {
  // ... existing fields
  featuredImage?: string;
}
```

### **Step 6: Update Helper**

`src/lib/contentstack-helpers.ts`:
```typescript
return {
  // ... existing fields
  featuredImage: csPost.featured_image?.url,
};
```

### **Step 7: Use Cloudinary Helper**

```typescript
import { getCloudinaryCardImage } from '@/lib/cloudinary';

// In PostCard component
{post.featuredImage && (
  <img
    src={getCloudinaryCardImage(post.featuredImage)}
    alt={post.title}
    className="w-full h-48 object-cover"
  />
)}
```

### **Step 8: Upload Images**

1. Go to Contentstack
2. Edit any post in `rohan_post`
3. Upload image in "Featured Image" field
4. Publish
5. Image appears optimized on frontend! ✅

---

## 🔍 Algolia Setup (Search)

### **Step 1: Create Algolia Account**

1. Sign up: https://www.algolia.com/users/sign_up
2. Create new application: **StackInsights**
3. Note your credentials:
   - **Application ID**: (e.g., `ABC123XYZ`)
   - **Search-Only API Key**: (e.g., `abc123...`)
   - **Admin API Key**: (e.g., `def456...`)

### **Step 2: Create Index**

1. **Algolia Dashboard** → **Indices**
2. Click **Create Index**
3. Name: `stackinsights_posts`

### **Step 3: Install Dependencies**

```bash
npm install algoliasearch
```

### **Step 4: Add Environment Variables**

`.env.local`:
```env
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_SEARCH_API_KEY=your_search_only_key
VITE_ALGOLIA_ADMIN_API_KEY=your_admin_key
```

### **Step 5: Sync Posts to Algolia**

**One-time sync:**
```bash
# Install tsx if not already
npm install -D tsx

# Run sync script
npx tsx scripts/sync-algolia.ts
```

**Expected output:**
```
🔄 Fetching posts from Contentstack...
📝 Found 6 posts
📤 Uploading to Algolia...
✅ Synced 6 posts to Algolia!
🔍 Search is now available
```

### **Step 6: Add Search to Homepage**

Replace the search input in `Index.tsx`:

```typescript
import { AlgoliaSearch } from '@/components/AlgoliaSearch';

// Replace the existing search section
<div className="mt-8">
  <AlgoliaSearch />
</div>
```

### **Step 7: Test Search**

1. Go to homepage
2. Type "kubernetes" or "database"
3. See instant results! ⚡

---

## 🎨 Usage Examples

### **Cloudinary Image Sizes**

```typescript
import { transformCloudinaryUrl } from '@/lib/cloudinary';

// Card image (800x450)
<img src={transformCloudinaryUrl(url, { width: 800, height: 450 })} />

// Thumbnail (100x100)
<img src={transformCloudinaryUrl(url, { width: 100, height: 100, crop: 'thumb' })} />

// Hero image (1200x630)
<img src={transformCloudinaryUrl(url, { width: 1200, height: 630 })} />
```

### **Algolia Search with Filters**

```typescript
import { searchPosts } from '@/lib/algolia';

// Basic search
const results = await searchPosts('kubernetes');

// Search with filters
const results = await searchPosts('incident', {
  category: 'incident',
  team: 'Infrastructure',
});

// Search by tags
const results = await searchPosts('database', {
  tags: ['postgres', 'performance'],
});
```

---

## 🔄 Automation: Webhook for Real-Time Sync

### **Keep Algolia in Sync with Contentstack**

**Option 1: Contentstack Webhook → Algolia**

1. **Contentstack** → **Settings** → **Webhooks**
2. Add webhook:
   - URL: Your serverless function URL
   - Triggers: `entry.publish`, `entry.unpublish`, `entry.delete`
   - Content Types: `rohan_post`

**Serverless Function (Vercel/Netlify):**
```typescript
// api/sync-to-algolia.ts
export default async function handler(req, res) {
  const { entry, content_type } = req.body;
  
  if (content_type.uid === 'rohan_post') {
    // Transform and index in Algolia
    await indexPost(entry);
  }
  
  res.status(200).json({ success: true });
}
```

**Option 2: Manual Sync (Current)**

Run sync script whenever content changes:
```bash
npx tsx scripts/sync-algolia.ts
```

---

## 📊 Features You Get

### **Cloudinary:**
✅ Auto-optimize images (WebP, compression)  
✅ Resize on-the-fly  
✅ CDN delivery (fast worldwide)  
✅ 25GB storage free  
✅ No frontend code changes needed  

### **Algolia:**
✅ Instant search (< 10ms)  
✅ Typo-tolerant ("kubrnetes" → "kubernetes")  
✅ Faceted filtering (team, category, tags)  
✅ Search analytics  
✅ 10,000 searches/month free  

---

## 🎯 Advanced Features

### **Cloudinary Transformations**

**Blur placeholder:**
```typescript
<img 
  src={transformCloudinaryUrl(url, { quality: 1, width: 20 })}
  className="blur-lg"
/>
```

**Face detection cropping:**
```typescript
<img 
  src={transformCloudinaryUrl(url, { 
    width: 200, 
    height: 200, 
    crop: 'fill',
    gravity: 'face'
  })}
/>
```

### **Algolia Search Insights**

Track popular searches, no-results queries, click-through rates:

```typescript
// Track search event
aa('clickedObjectIDsAfterSearch', {
  eventName: 'Post Clicked',
  objectIDs: [postId],
  queryID: searchQueryID,
});
```

---

## 💰 Pricing

### **Cloudinary Free Tier:**
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month
- **Enough for:** ~2,500 images

### **Algolia Free Tier:**
- 10,000 search requests/month
- 10,000 records
- **Enough for:** 100+ searches/day

### **When to Upgrade:**
- Cloudinary: When you hit bandwidth limits
- Algolia: When you have > 10K posts or need analytics

---

## ✅ Checklist

### **Cloudinary:**
- [ ] Sign up for Cloudinary
- [ ] Install in Contentstack Marketplace
- [ ] Add `featured_image` field to `rohan_post`
- [ ] Update TypeScript interfaces
- [ ] Update helper function
- [ ] Use `getCloudinaryCardImage()` helper
- [ ] Upload images to posts
- [ ] Test on frontend

### **Algolia:**
- [ ] Sign up for Algolia
- [ ] Create `stackinsights_posts` index
- [ ] Install `algoliasearch` npm package
- [ ] Add environment variables
- [ ] Run sync script
- [ ] Add `AlgoliaSearch` component
- [ ] Test search functionality
- [ ] Set up webhook (optional)

---

## 🚀 Next Steps

1. **Set up Cloudinary** (30 min)
2. **Set up Algolia** (1 hour)
3. **Upload images to posts** (30 min)
4. **Test search** (15 min)
5. **Configure webhook** (optional, 30 min)

---

## 🆘 Troubleshooting

### **Cloudinary images not loading:**
- Check `VITE_CLOUDINARY_CLOUD_NAME` is set
- Verify images are uploaded in Contentstack
- Check browser console for CORS errors

### **Algolia search not working:**
- Run sync script: `npx tsx scripts/sync-algolia.ts`
- Check API keys in `.env.local`
- Verify index name is `stackinsights_posts`
- Check browser console for errors

### **Slow image loading:**
- Use `getCloudinaryCardImage()` helper
- Enable auto-format and auto-quality
- Check image sizes (< 1MB recommended)

---

**Both services are now production-ready!** 🎉
