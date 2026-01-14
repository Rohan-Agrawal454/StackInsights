// Data types and author profiles for StackInsights
// Note: Posts, teams, and categories are now managed in Contentstack CMS
import profileImage from '@/assets/profile.jpg';

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
  author: Author;
  team: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  readTime: number;
  featured?: boolean;
}

// Author profiles (user data, not in CMS as it's auth-based)
export const authors: Author[] = [
  {
    id: '1',
    name: 'Rohan Agrawal',
    role: 'ASE Intern',
    team: 'Launch',
    location: 'Hybrid',
    avatar: profileImage,
    bio: 'Building resilient systems at scale. Passionate about developer experience and distributed systems.',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Senior SRE',
    team: 'Infra',
    location: 'Hybrid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    bio: 'Site Reliability Engineer focused on observability and incident response. Loves automating everything.',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Engineering Manager',
    team: 'Product',
    location: 'Hybrid',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    bio: 'Leading high-performing teams building user-facing features. Advocate for continuous improvement.',
  },
  {
    id: '4',
    name: 'Alex Kim',
    role: 'Backend Engineer',
    team: 'API',
    location: 'Hybrid',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'API design enthusiast. Building scalable microservices and developer tools.',
  },
];

// UI Helper functions for categories
export function getCategoryLabel(category: PostCategory): string {
  const labels: Record<PostCategory, string> = {
    insight: 'Insights',
    incident: 'Incidents',
    retrospective: 'Retrospectives',
  };
  return labels[category];
}

export function getCategoryColor(category: PostCategory): string {
  const colors: Record<PostCategory, string> = {
    insight: 'bg-insight/10 text-insight',
    incident: 'bg-incident/10 text-incident',
    retrospective: 'bg-retro/10 text-retro',
  };
  return colors[category];
}