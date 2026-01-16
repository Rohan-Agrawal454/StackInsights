/**
 * Shared TypeScript interfaces for the application
 * All data comes from Contentstack CMS
 */

export type PostCategory = 'insight' | 'incident' | 'retrospective';

export interface Author {
  id: string;
  name: string;
  role: string;
  team: string;
  location: string;
  avatar: string;
  bio: string;
}

export interface PostContent {
  context: string;
  problem?: string;
  resolution?: string;
  learnings?: string;
  achievements?: string;
  challenges?: string;
  improvements?: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: PostContent;
  category: PostCategory;
  categoryLabel: string; // Display label from CMS
  author: Author;
  team: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  readTime: number;
  featured?: boolean;
}
