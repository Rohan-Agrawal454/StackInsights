import Stack from './contentstack';
import Personalize from '@contentstack/personalize-edge-sdk';
import type {
  NavbarContent,
  FooterContent,
  HomepageContent,
  AboutPageContent,
  BrowsePageContent,
  ProfilePageContent,
  CreatePostContent,
  EditPostContent,
  ContentstackTeam,
  ContentstackCategory,
  ContentstackPost,
  ContentstackAuthor,
} from '@/types/contentstack';
import type { Post, Author } from '@/types';
import { mapContentstackPostToPost, mapContentstackAuthorToAuthor, processCopyrightText } from './contentstack-helpers';

export { processCopyrightText };

/**
 * Fetch Navbar Content (Singleton)
 */
export async function fetchNavbar(): Promise<NavbarContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_navbar')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as NavbarContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching navbar:', error);
    return null;
  }
}

/**
 * Fetch Footer Content (Singleton)
 */
export async function fetchFooter(): Promise<FooterContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_footer')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as FooterContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}

/**
 * Fetch Homepage Content (Default)
 * Specifically looks for the entry titled "HomePage" for the default homepage
 */
export async function fetchHomepage(): Promise<HomepageContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_homepage')
      .entry()
      .query()
      .limit(20) // Get all entries to search for default
      .find();
    
    if (result.entries && result.entries.length > 0) {
      // Look for entry specifically titled "HomePage" for the default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const defaultEntry = result.entries.find((entry: any) => entry.title === 'HomePage');
      
      if (defaultEntry) {
        console.log('✅ Found default homepage entry: "HomePage"');
        return defaultEntry as unknown as HomepageContent;
      }
      
      // If no "HomePage" entry found, use the first entry
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(`⚠️ No entry titled "HomePage" found, using first entry: "${(result.entries[0] as any)?.title}"`);
      return result.entries[0] as unknown as HomepageContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

/**
 * Fetch ALL Homepage entries from Contentstack
 * Returns all homepage variants stored as separate entries
 */
export async function fetchAllHomepages(): Promise<HomepageContent[]> {
  try {
    // Fetch ALL homepage entries - set limit high to get all variants
    const result = await Stack
      .contentType('rohan_homepage')
      .entry()
      .query()
      .limit(20) // Get up to 20 homepage variants
      .find();
    
    if (result.entries && result.entries.length > 0) {
      console.log(`📦 Fetched ${result.entries.length} homepage entries from CMS`);
      // List all entry titles for debugging
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const titles = result.entries.map((entry: any) => entry.title || 'Untitled').join(', ');
      console.log(`   Entries: ${titles}`);
      return result.entries as unknown as HomepageContent[];
    }
    console.log('⚠️ No homepage entries found in CMS');
    return [];
  } catch (error) {
    console.error('❌ Error fetching all homepages:', error);
    return [];
  }
}

/**
 * Fetch Personalized Homepage using Contentstack Personalize Edge SDK
 * This uses the official Personalize SDK to fetch variant-based content from Contentstack
 */
export async function fetchPersonalizedHomepage(userId: string, attributes: {
  team: string;
  reading_frequency: string;
  expertise_level: string;
  favorite_category: string;
  is_engineering_team_reader: boolean;
}): Promise<HomepageContent | null> {
  const PERSONALIZE_ENABLED = import.meta.env.VITE_CONTENTSTACK_PERSONALIZE_ENABLED === 'true';
  const PERSONALIZE_PROJECT_UID = import.meta.env.VITE_CONTENTSTACK_PERSONALIZE_PROJECT_ID;
  
  if (!PERSONALIZE_ENABLED || !PERSONALIZE_PROJECT_UID) {
    console.log('ℹ️ Personalize not configured, fetching default homepage');
    return fetchHomepage();
  }
  
  try {
    console.log('🎯 Initializing Contentstack Personalize Edge SDK...');
    console.log('   User ID:', userId);
    console.log('   Attributes:', JSON.stringify(attributes, null, 2));
    
    // Initialize Personalize Edge SDK with user ID first
    const personalizeSdk = await Personalize.init(PERSONALIZE_PROJECT_UID, {
      userId: userId,
    });
    
    console.log('✅ Personalize SDK initialized');
    
    // Set user attributes explicitly using the set() method
    // This persists attributes to Contentstack's edge network
    // IMPORTANT: Keys must match exactly what's configured in Contentstack Attributes
    await personalizeSdk.set({
      team: attributes.team,
      reading_frequency: attributes.reading_frequency,
      expertise_level: attributes.expertise_level,
      favorite_category: attributes.favorite_category,
      is_engineering_team_reader: String(attributes.is_engineering_team_reader),
    });
    
    console.log('✅ User attributes set:', {
      team: attributes.team,
      reading_frequency: attributes.reading_frequency,
      expertise_level: attributes.expertise_level,
      favorite_category: attributes.favorite_category,
      is_engineering_team_reader: String(attributes.is_engineering_team_reader),
    });
    
    // Get active experiences and variant aliases
    const experiences = personalizeSdk.getExperiences();
    const variantAliases = personalizeSdk.getVariantAliases();
    
    console.log('📊 Active Experiences:', experiences);
    console.log('🎨 Variant Aliases:', variantAliases);
    
    // Debug: Check if any variant is active
    if (experiences && experiences.length > 0) {
      experiences.forEach((exp, index) => {
        if (exp.activeVariantShortUid === null) {
          console.warn(`⚠️ Experience ${index + 1} (shortUid: ${exp.shortUid}): No variant matched!`);
          console.warn('   Possible reasons:');
          console.warn('   1. User attributes don\'t match any audience criteria');
          console.warn('   2. Experience isn\'t published or active');
          console.warn('   3. No variants configured for this experience');
        } else {
          console.log(`✅ Experience ${index + 1} (shortUid: ${exp.shortUid}): Variant ${exp.activeVariantShortUid} matched`);
        }
      });
    }
    
    if (!variantAliases || variantAliases.length === 0) {
      console.warn('⚠️ No variant aliases returned - user will see default content');
      console.warn('   Check Contentstack Personalize dashboard to ensure:');
      console.warn('   1. Experience is Published and Active');
      console.warn('   2. Audiences are configured correctly');
      console.warn('   3. User attributes match at least one audience');
    }
    
    // Step 1: Get the default homepage entry to find its UID
    const defaultHomepage = await fetchHomepage();
    if (!defaultHomepage) {
      console.warn('⚠️ Could not fetch default homepage');
      return null;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const homepageUid = (defaultHomepage as any).uid;
    if (!homepageUid) {
      console.warn('⚠️ Homepage UID not found in default entry');
      return defaultHomepage;
    }
    
    console.log('📍 Homepage Entry UID:', homepageUid);
    
    // Step 2: Fetch the entry with variants using the .variants() method
    const entryCall = Stack
      .contentType('rohan_homepage')
      .entry(homepageUid);
    
    let personalizedEntry;
    
    if (variantAliases && variantAliases.length > 0) {
      console.log('🎯 Fetching personalized variant...');
      // Convert variant aliases array to comma-separated string
      const variantAliasString = variantAliases.join(',');
      console.log('   Variant Alias String:', variantAliasString);
      
      // Use the .variants() method as per Contentstack documentation
      personalizedEntry = await entryCall.variants(variantAliasString).fetch();
    } else {
      console.log('ℹ️ No variants matched, fetching default content');
      personalizedEntry = await entryCall.fetch();
    }
    
    if (personalizedEntry) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('✨ Personalized content fetched:', (personalizedEntry as any).title);
      console.log('   📈 Impression tracked in Contentstack Analytics!');
      
      // Trigger impression event for analytics if a variant was selected
      if (experiences.length > 0 && experiences[0].activeVariantShortUid) {
        try {
          await personalizeSdk.triggerImpression(experiences[0].shortUid);
          console.log('   📊 Impression event triggered');
        } catch (error) {
          console.warn('   ⚠️ Could not trigger impression:', error);
        }
      }
      
      return personalizedEntry as unknown as HomepageContent;
    }
    
    console.log('⚠️ No personalized content found, using default');
    return defaultHomepage;
  } catch (error) {
    console.error('❌ Error fetching personalized homepage:', error);
    console.error('   Falling back to default homepage');
    return fetchHomepage();
  }
}

/**
 * Fetch About Page Content (Singleton)
 */
export async function fetchAboutPage(): Promise<AboutPageContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_about')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as AboutPageContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

/**
 * Fetch Browse Page Content (Singleton)
 */
export async function fetchBrowsePage(): Promise<BrowsePageContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_browse')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as BrowsePageContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching browse page:', error);
    return null;
  }
}

/**
 * Fetch Profile Page Content (Singleton)
 */
export async function fetchProfilePage(): Promise<ProfilePageContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_profilepage')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as ProfilePageContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile page:', error);
    return null;
  }
}

/**
 * Fetch Create Post Page Content (Singleton)
 */
export async function fetchCreatePostContent(): Promise<CreatePostContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_createpost')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as CreatePostContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching create post content:', error);
    return null;
  }
}

/**
 * Fetch Edit Post Page Content (Singleton)
 */
export async function fetchEditPostContent(): Promise<EditPostContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_editpost')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as EditPostContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching edit post content:', error);
    return null;
  }
}

/**
 * Fetch All Teams (sorted by display_order)
 */
export async function fetchTeams(): Promise<ContentstackTeam[]> {
  try {
    const result = await Stack
      .contentType('rohan_teams')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      const teams = result.entries as unknown as ContentstackTeam[];
      // Sort by display_order
      return teams.sort((a, b) => a.display_order - b.display_order);
    }
    return [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

/**
 * Fetch All Categories (sorted by display_order)
 */
export async function fetchCategories(): Promise<ContentstackCategory[]> {
  try {
    const result = await Stack
      .contentType('rohan_categories')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      const categories = result.entries as unknown as ContentstackCategory[];
      // Sort by display_order
      return categories.sort((a, b) => a.display_order - b.display_order);
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch All Authors
 */
export async function fetchAuthors(): Promise<ContentstackAuthor[]> {
  try {
    const result = await Stack
      .contentType('rohan_author')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries as unknown as ContentstackAuthor[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

/**
 * Fetch Author by ID
 */
export async function fetchAuthorById(authorId: string): Promise<ContentstackAuthor | null> {
  try {
    const allAuthors = await fetchAuthors();
    return allAuthors.find(author => author.author_id.toString() === authorId) || null;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

/**
 * Get all authors and convert to app format
 */
export async function getAllAuthors(): Promise<Author[]> {
  const [csAuthors, teams] = await Promise.all([fetchAuthors(), fetchTeams()]);
  return csAuthors.map(author => mapContentstackAuthorToAuthor(author, teams));
}

/**
 * Get author by ID and convert to app format
 */
export async function getAuthorById(authorId: string): Promise<Author | null> {
  const [csAuthor, teams] = await Promise.all([fetchAuthorById(authorId), fetchTeams()]);
  if (!csAuthor) return null;
  return mapContentstackAuthorToAuthor(csAuthor, teams);
}

/**
 * Fetch All Posts
 */
export async function fetchPosts(): Promise<ContentstackPost[]> {
  try {
    const result = await Stack
      .contentType('rohan_post')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries as unknown as ContentstackPost[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

/**
 * Fetch Single Post by UID
 */
export async function fetchPostByUid(uid: string): Promise<ContentstackPost | null> {
  try {
    const allPosts = await fetchPosts();
    return allPosts.find(post => post.uid === uid) || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

/**
 * Fetch Posts by Author ID
 */
export async function fetchPostsByAuthor(authorId: string): Promise<ContentstackPost[]> {
  try {
    const allPosts = await fetchPosts();
    return allPosts.filter(post => {
      const authorRef = post.author_id?.[0];
      if (!authorRef) return false;
      // Check if it's a populated reference or just a UID
      if ('author_id' in authorRef) {
        return (authorRef as ContentstackAuthor).author_id.toString() === authorId;
      }
      // For unpopulated references, we need to fetch and compare
      return false; // Will be handled in the conversion step
    });
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    return [];
  }
}

/**
 * Fetch Featured Posts
 */
export async function fetchFeaturedPosts(): Promise<ContentstackPost[]> {
  try {
    const allPosts = await fetchPosts();
    return allPosts.filter(post => post.featured === true);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

/**
 * Get all posts and convert to app format
 */
export async function getAllPosts(): Promise<Post[]> {
  const [csPosts, csAuthors, teams, categories] = await Promise.all([
    fetchPosts(),
    fetchAuthors(),
    fetchTeams(),
    fetchCategories()
  ]);
  return csPosts
    .map(post => mapContentstackPostToPost(post, csAuthors, teams, categories))
    .filter((post): post is Post => post !== null);
}

/**
 * Get posts by author and convert to app format
 */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  const [csPosts, csAuthors, teams, categories] = await Promise.all([
    fetchPosts(),
    fetchAuthors(),
    fetchTeams(),
    fetchCategories()
  ]);
  
  // Filter posts by author after conversion
  return csPosts
    .map(post => mapContentstackPostToPost(post, csAuthors, teams, categories))
    .filter((post): post is Post => post !== null)
    .filter(post => post.author.id === authorId);
}

/**
 * Get single post by uid and convert to app format
 */
export async function getPostByUid(uid: string): Promise<Post | null> {
  const [csPost, csAuthors, teams, categories] = await Promise.all([
    fetchPostByUid(uid),
    fetchAuthors(),
    fetchTeams(),
    fetchCategories()
  ]);
  if (!csPost) return null;
  return mapContentstackPostToPost(csPost, csAuthors, teams, categories);
}

/**
 * Get featured posts and convert to app format
 */
export async function getFeaturedPosts(): Promise<Post[]> {
  const [csPosts, csAuthors, teams, categories] = await Promise.all([
    fetchFeaturedPosts(),
    fetchAuthors(),
    fetchTeams(),
    fetchCategories()
  ]);
  return csPosts
    .map(post => mapContentstackPostToPost(post, csAuthors, teams, categories))
    .filter((post): post is Post => post !== null);
}


