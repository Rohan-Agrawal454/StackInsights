import { authors, type Post } from '@/lib/data';
import type { ContentstackPost } from '@/types/contentstack';

/**
 * Helper: Convert ContentstackPost to Post (with author lookup)
 */
export function mapContentstackPostToPost(csPost: ContentstackPost): Post | null {
  // Handle null author_id
  if (!csPost.author_id) {
    console.warn(`No author_id for post: ${csPost.uid}`);
    return null;
  }

  const author = authors.find(a => a.id === csPost.author_id.toString());
  
  if (!author) {
    console.warn(`Author not found for post: ${csPost.uid}`);
    return null;
  }

  // Parse tags from multiline text
  const tags = csPost.tags_post
    ? csPost.tags_post.split('\n').map(t => t.trim()).filter(Boolean)
    : [];

  // Calculate read time (rough estimate: 30 words per minute)
  const wordCount = Object.values(csPost.content).join(' ').split(' ').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 30));

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
