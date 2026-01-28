/**
 * Contentstack Management API for creating and publishing posts
 */

const API_KEY = import.meta.env.VITE_CONTENTSTACK_API_KEY;
const MANAGEMENT_TOKEN = import.meta.env.VITE_CONTENTSTACK_MANAGEMENT_TOKEN;
const API_HOST = 'https://api.contentstack.io';
const ENVIRONMENT = 'dev'; // Change to your environment

interface ContentField {
  context?: string;
  problem?: string;
  resolution?: string;
  achievements?: string;
  challenges?: string;
  improvements?: string;
  learnings?: string;
}

interface CreatePostData {
  title: string;
  title_post: string;
  category: string;
  excerpt: string;
  featured: boolean;
  author_id: Array<{ uid: string; _content_type_uid: string }>;
  tags_post: string;
  content: ContentField;
}

interface CreatePostResponse {
  success: boolean;
  uid?: string;
  data?: unknown;
  error?: string;
}

/**
 * Create a new post entry using Management API
 */
export async function createPost(postData: CreatePostData): Promise<CreatePostResponse> {
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    return {
      success: false,
      error: 'Missing API credentials. Please set VITE_CONTENTSTACK_MANAGEMENT_TOKEN in .env.local',
    };
  }

  try {
    const url = `${API_HOST}/v3/content_types/rohan_post/entries`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
      },
      body: JSON.stringify({ entry: postData }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error_message || data.errors || 'Failed to create post',
        data,
      };
    }

    return {
      success: true,
      uid: data.entry?.uid,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Publish an entry using Management API
 */
export async function publishEntry(
  contentTypeUid: string,
  entryUid: string,
  version: number
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  if (!API_KEY || !MANAGEMENT_TOKEN) {
    return {
      success: false,
      error: 'Missing API credentials',
    };
  }

  try {
    const url = `${API_HOST}/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`;
    
    const body = {
      entry: {
        environments: [ENVIRONMENT],
        locales: ['en-us'],
      },
      locale: 'en-us',
      version: version,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error_message || data.errors || 'Failed to publish entry',
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create and publish a post in one operation
 */
export async function createAndPublishPost(postData: CreatePostData): Promise<CreatePostResponse> {
  // Step 1: Create the entry
  const createResult = await createPost(postData);
  
  if (!createResult.success || !createResult.uid) {
    return createResult;
  }

  // Step 2: Publish the entry
  const entryUid = createResult.uid;
  const version = (createResult.data as { entry?: { _version?: number } })?.entry?._version || 1;
  
  const publishResult = await publishEntry('rohan_post', entryUid, version);
  
  if (!publishResult.success) {
    return {
      success: false,
      uid: entryUid,
      error: `Post created but failed to publish: ${publishResult.error}`,
    };
  }

  return {
    success: true,
    uid: entryUid,
    data: publishResult.data,
  };
}
