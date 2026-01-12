// Mock data for StackInsights
import profileImage from '@/assets/profile.jpg';

export type PostCategory = 'insight' | 'incident' | 'retrospective';

export interface Author {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar: string;
  bio: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  author: Author;
  team: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  readTime: number;
  featured?: boolean;
}

export const authors: Author[] = [
  {
    id: '1',
    name: 'Rohan Agrawal',
    role: 'ASE Intern',
    team: 'Launch',
    avatar: profileImage,
    bio: 'Building resilient systems at scale. Passionate about developer experience and distributed systems.',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Senior SRE',
    team: 'Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    bio: 'Site Reliability Engineer focused on observability and incident response. Loves automating everything.',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Engineering Manager',
    team: 'Product',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    bio: 'Leading high-performing teams building user-facing features. Advocate for continuous improvement.',
  },
  {
    id: '4',
    name: 'Alex Kim',
    role: 'Backend Engineer',
    team: 'API',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    bio: 'API design enthusiast. Building scalable microservices and developer tools.',
  },
];

export const posts: Post[] = [
  {
    id: '1',
    title: 'Migrating to Event-Driven Architecture: Lessons',
    excerpt: 'How we transitioned our monolithic order processing system to an event-driven architecture, reducing latency by 60% and improving system resilience.',
    category: 'insight',
    author: authors[0],
    team: 'Platform',
    tags: ['architecture', 'events', 'kafka', 'microservices'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-10',
    readTime: 12,
    featured: true,
  },
  {
    id: '2',
    title: 'Database Connection Pool Exhaustion Incident',
    excerpt: 'Post-mortem analysis of the January 5th database outage that impacted checkout services for 47 minutes.',
    category: 'incident',
    author: authors[1],
    team: 'Infrastructure',
    tags: ['postgres', 'incident', 'database', 'connection-pool'],
    createdAt: '2024-01-06',
    updatedAt: '2024-01-07',
    readTime: 8,
    featured: true,
  },
  {
    id: '3',
    title: 'Q4 2023 Platform Team Retrospective',
    excerpt: 'Reflecting on our major achievements, challenges faced, and improvements identified during the fourth quarter.',
    category: 'retrospective',
    author: authors[2],
    team: 'Platform',
    tags: ['retro', 'team', 'process', 'improvement'],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    readTime: 6,
  },
  {
    id: '4',
    title: 'Implementing Rate Limiting at Scale',
    excerpt: 'A deep dive into our new rate limiting infrastructure using Redis and sliding window algorithms.',
    category: 'insight',
    author: authors[3],
    team: 'API',
    tags: ['rate-limiting', 'redis', 'api', 'scalability'],
    createdAt: '2024-01-04',
    updatedAt: '2024-01-05',
    readTime: 15,
  },
  {
    id: '5',
    title: 'CDN Cache Invalidation Failure',
    excerpt: 'How a misconfigured cache invalidation rule led to stale content being served for 2 hours.',
    category: 'incident',
    author: authors[1],
    team: 'Infrastructure',
    tags: ['cdn', 'cache', 'incident', 'cloudflare'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    readTime: 5,
  },
  {
    id: '6',
    title: 'Adopting TypeScript Strict Mode',
    excerpt: 'Our journey to enable strict mode across 200+ TypeScript files and the benefits we realized.',
    category: 'insight',
    author: authors[0],
    team: 'Platform',
    tags: ['typescript', 'dx', 'code-quality'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    readTime: 10,
  },
];

export const teams = ['All Teams', 'Platform', 'Infrastructure', 'Product', 'API', 'Frontend', 'Mobile'];
export const categories: PostCategory[] = ['insight', 'incident', 'retrospective'];
export const allTags = [...new Set(posts.flatMap(p => p.tags))];

export function getCategoryLabel(category: PostCategory): string {
  const labels: Record<PostCategory, string> = {
    insight: 'Insight',
    incident: 'Incident',
    retrospective: 'Retrospective',
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