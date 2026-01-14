import Stack from './contentstack';
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
} from '@/types/contentstack';
import type { Post } from '@/lib/data';
import { mapContentstackPostToPost, processCopyrightText } from './contentstack-helpers';

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
 * Fetch Homepage Content (Singleton)
 */
export async function fetchHomepage(): Promise<HomepageContent | null> {
  try {
    const result = await Stack
      .contentType('rohan_homepage')
      .entry()
      .query()
      .find();
    
    if (result.entries && result.entries.length > 0) {
      return result.entries[0] as unknown as HomepageContent;
    }
    return null;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
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
export async function fetchPostsByAuthor(authorId: number): Promise<ContentstackPost[]> {
  try {
    const allPosts = await fetchPosts();
    return allPosts.filter(post => post.author_id === authorId);
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
  const csPosts = await fetchPosts();
  return csPosts
    .map(mapContentstackPostToPost)
    .filter((post): post is Post => post !== null);
}

/**
 * Get posts by author and convert to app format
 */
export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const csPosts = await fetchPostsByAuthor(authorId);
  return csPosts
    .map(mapContentstackPostToPost)
    .filter((post): post is Post => post !== null);
}

/**
 * Get single post by uid and convert to app format
 */
export async function getPostByUid(uid: string): Promise<Post | null> {
  const csPost = await fetchPostByUid(uid);
  if (!csPost) return null;
  return mapContentstackPostToPost(csPost);
}

/**
 * Get featured posts and convert to app format
 */
export async function getFeaturedPosts(): Promise<Post[]> {
  const csPosts = await fetchFeaturedPosts();
  return csPosts
    .map(mapContentstackPostToPost)
    .filter((post): post is Post => post !== null);
}


