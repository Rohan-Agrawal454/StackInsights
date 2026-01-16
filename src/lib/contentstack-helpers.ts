import type { Post, Author } from '@/types';
import type { ContentstackPost, ContentstackAuthor, ContentstackTeam, ContentstackCategory } from '@/types/contentstack';

/**
 * Helper: Convert ContentstackAuthor to Author
 * @param csAuthor - The author from Contentstack
 * @param teams - Array of all teams to lookup from (for unpopulated references)
 */
export function mapContentstackAuthorToAuthor(
  csAuthor: ContentstackAuthor,
  teams: ContentstackTeam[] = []
): Author {
  // Handle team reference (may be populated or just UID)
  let teamName = '';
  const teamRef = csAuthor.team?.[0];
  if (teamRef) {
    if (teamRef.team_name) {
      // Team reference is populated
      teamName = teamRef.team_name;
    } else {
      // Team reference is just a UID, look it up
      const teamData = teams.find(t => t.uid === teamRef.uid);
      teamName = teamData?.team_name || '';
    }
  }

  return {
    id: csAuthor.author_id.toString(), // Convert number to string
    name: csAuthor.full_name,
    role: csAuthor.role,
    team: teamName,
    location: csAuthor.location || 'Hybrid',
    avatar: csAuthor.avatar?.url || '',
    bio: csAuthor.bio || '',
  };
}

/**
 * Helper: Convert ContentstackPost to Post (with author lookup)
 * @param csPost - The post from Contentstack
 * @param authors - Array of all authors to lookup from
 * @param teams - Array of all teams to lookup from (for unpopulated references)
 * @param categories - Array of all categories to lookup labels from
 */
export function mapContentstackPostToPost(
  csPost: ContentstackPost,
  authors: ContentstackAuthor[],
  teams: ContentstackTeam[] = [],
  categories: ContentstackCategory[] = []
): Post | null {
  // Check if author reference exists
  if (!csPost.author_id || csPost.author_id.length === 0) {
    console.warn(`No author for post: ${csPost.uid}`);
    return null;
  }

  const authorRef = csPost.author_id[0];
  
  // Check if the reference is populated or just a UID
  let author: Author;
  if ('full_name' in authorRef) {
    // Reference is fully populated
    author = mapContentstackAuthorToAuthor(authorRef as ContentstackAuthor, teams);
  } else {
    // Reference is just a UID, need to look it up
    const authorData = authors.find(a => a.uid === authorRef.uid);
    if (!authorData) {
      console.warn(`Author not found for post: ${csPost.uid}, author UID: ${authorRef.uid}`);
      return null;
    }
    author = mapContentstackAuthorToAuthor(authorData, teams);
  }

  // Parse tags from multiline text
  const tags = csPost.tags_post
    ? csPost.tags_post.split('\n').map(t => t.trim()).filter(Boolean)
    : [];

  // Calculate read time (rough estimate: 40 words per minute)
  const wordCount = Object.values(csPost.content).join(' ').split(' ').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 40));

  // Look up category label from CMS
  const categoryData = categories.find(c => c.category_value === csPost.category);
  const categoryLabel = categoryData?.category_label || csPost.category;

  return {
    id: csPost.uid,
    title: csPost.title_post,
    excerpt: csPost.excerpt,
    content: {
      context: csPost.content.context || '',
      problem: csPost.content.problem,
      resolution: csPost.content.resolution,
      learnings: csPost.content.learnings,
      achievements: csPost.content.achievements,
      challenges: csPost.content.challenges,
      improvements: csPost.content.improvements,
    },
    category: csPost.category,
    categoryLabel,
    featuredImage: csPost.featured_image?.url,
    author,
    team: author.team,
    tags,
    createdAt: csPost.published_date || csPost.created_at,
    updatedAt: csPost.updated_at,
    readTime,
    featured: csPost.featured,
  };
}

/**
 * Helper function to process copyright text with year replacement
 */
export function processCopyrightText(copyrightText: string): string {
  const currentYear = new Date().getFullYear();
  return copyrightText.replace('{year}', currentYear.toString());
}
