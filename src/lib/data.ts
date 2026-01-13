// Mock data for StackInsights
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
    team: 'Infrastructure',
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

export const posts: Post[] = [
  {
    id: '1',
    title: 'Migrating to Event-Driven Architecture: Lessons',
    excerpt: 'How we transitioned our monolithic order processing system to an event-driven architecture, reducing latency by 60% and improving system resilience.',
    category: 'insight',
    author: authors[0],
    team: authors[0].team,
    tags: ['architecture', 'events', 'kafka', 'microservices'],
    createdAt: '2026-01-08',
    updatedAt: '2026-01-10',
    readTime: 12,
    featured: true,
    content: {
      context: 'Our order processing system was originally built as a monolithic application handling everything from order creation to fulfillment. As we scaled to handle 10x more orders, we started experiencing significant latency issues during peak hours. The synchronous nature of our system meant that any slow downstream service would block the entire order flow.',
      problem: 'The core challenges we faced included: synchronous blocking calls between services, tight coupling making it difficult to scale individual components, and cascading failures when one service went down. During Black Friday, our system struggled to handle the load, with order processing times increasing from 200ms to over 5 seconds.',
      resolution: 'We implemented an event-driven architecture using Apache Kafka as our message broker. Orders are now published as events, and downstream services consume these events asynchronously. We also introduced event sourcing for critical workflows, allowing us to replay events for debugging and recovery. The migration was done incrementally, starting with non-critical paths and gradually moving core functionality.',
      learnings: 'Key takeaways from this migration: Event-driven systems require careful event schema design and versioning. Monitoring event lag and processing times is crucial for maintaining system health. Idempotency is essential when processing events that might be retried. The decoupled nature improved our ability to deploy services independently, reducing deployment risk by 70%.'
    },
  },
  {
    id: '2',
    title: 'Database Connection Pool Exhaustion Incident',
    excerpt: 'Post-mortem analysis of the January 5th database outage that impacted checkout services for 47 minutes.',
    category: 'incident',
    author: authors[1],
    team: authors[1].team,
    tags: ['postgres', 'incident', 'database', 'connection-pool'],
    createdAt: '2024-01-06',
    updatedAt: '2024-01-07',
    readTime: 8,
    featured: true,
    content: {
      context: 'On January 5th at 14:23 UTC, our checkout service began experiencing high error rates. Initial investigation showed 503 errors increasing from 0.1% to 15% within 5 minutes. The service connects to a PostgreSQL database using a connection pool with a maximum of 100 connections.',
      problem: 'The incident was caused by a connection pool exhaustion. A scheduled job that processes refunds was misconfigured and opened 80 database connections without properly closing them. Combined with normal application traffic, this exhausted our connection pool. New requests couldn\'t acquire database connections, causing checkout failures. The issue was compounded by connection timeout settings that were too aggressive, causing legitimate queries to fail.',
      resolution: 'We immediately identified the problematic job and disabled it. We then increased the connection pool size from 100 to 200 as a temporary measure. For the long-term fix, we implemented connection pool monitoring with alerts, added connection leak detection, and refactored the refund job to use connection pooling properly. We also adjusted timeout settings to be more forgiving during peak loads.',
      learnings: 'This incident highlighted several important lessons: Always monitor connection pool utilization, not just database CPU/memory. Scheduled jobs need the same connection management discipline as application code. Connection pool exhaustion can cascade quickly - we need better circuit breakers. We\'ve since implemented automated connection leak detection that alerts us when connections aren\'t returned within expected timeframes.'
    },
  },
  {
    id: '3',
    title: 'Q4 2023 Platform Team Retrospective',
    excerpt: 'Reflecting on our major achievements, challenges faced, and improvements identified during the fourth quarter.',
    category: 'retrospective',
    author: authors[2],
    team: authors[2].team,
    tags: ['retro', 'team', 'process', 'improvement'],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    readTime: 6,
    content: {
      context: 'Q4 2023 was a transformative quarter for the Platform team. We grew from 8 to 12 engineers, launched three major infrastructure initiatives, and supported 15 product teams with their scaling needs. This retrospective captures our collective learnings and sets the stage for Q1 2024.',
      achievements: 'Major wins this quarter: Successfully migrated 80% of services to Kubernetes, reducing infrastructure costs by 30%. Launched our internal developer portal, reducing onboarding time from 2 weeks to 3 days. Implemented comprehensive observability stack (metrics, logs, traces) that reduced MTTR by 40%. Established Platform Office Hours, helping 50+ engineers solve infrastructure challenges.',
      challenges: 'Areas where we struggled: Balancing feature work with infrastructure improvements - we often deprioritized tech debt. Communication gaps between Platform and Product teams led to some misaligned priorities. On-call rotation was stressful with limited documentation and runbooks. Some team members felt overwhelmed by the rapid growth and changing priorities.',
      improvements: 'Actions for Q1 2024: Implement a 70/30 split - 70% infrastructure improvements, 30% feature work. Establish weekly sync meetings with Product team leads. Create comprehensive runbooks for all critical systems. Introduce "Infrastructure Fridays" for focused tech debt work. Launch a mentorship program to help new team members ramp up faster.'
    },
  },
  {
    id: '4',
    title: 'Implementing Rate Limiting at Scale',
    excerpt: 'A deep dive into our new rate limiting infrastructure using Redis and sliding window algorithms.',
    category: 'insight',
    author: authors[3],
    team: authors[3].team,
    tags: ['rate-limiting', 'redis', 'api', 'scalability'],
    createdAt: '2024-01-04',
    updatedAt: '2024-01-05',
    readTime: 15,
    content: {
      context: 'As our API grew to handle millions of requests per day, we needed a robust rate limiting solution to prevent abuse and ensure fair resource allocation. Our previous approach used in-memory counters per application instance, which didn\'t work well in a distributed system with multiple API servers.',
      problem: 'The challenges we faced: In-memory rate limiting didn\'t work across multiple API instances - users could bypass limits by hitting different servers. Fixed window algorithms caused thundering herd problems at window boundaries. We needed different rate limits for different user tiers (free, pro, enterprise). Rate limit headers needed to be consistent across all API responses.',
      resolution: 'We implemented a distributed rate limiting system using Redis with a sliding window algorithm. Each API key gets a sorted set in Redis with timestamps of recent requests. We use Lua scripts for atomic operations to check and update rate limits. The system supports multiple rate limit tiers and provides accurate rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset). We also implemented a token bucket algorithm for burst handling.',
      learnings: 'Key insights from this implementation: Redis Lua scripts are essential for atomic rate limit checks - without them, race conditions cause inaccurate limits. Sliding window algorithms are more accurate than fixed windows but require more Redis memory. We cache rate limit decisions locally for 100ms to reduce Redis load. Monitoring Redis memory usage is critical - we set up alerts when sorted sets exceed 10MB. The system now handles 50,000 requests/second with sub-millisecond latency overhead.'
    },
  },
  {
    id: '5',
    title: 'CDN Cache Invalidation Failure',
    excerpt: 'How a misconfigured cache invalidation rule led to stale content being served for 2 hours.',
    category: 'incident',
    author: authors[1],
    team: authors[1].team,
    tags: ['cdn', 'cache', 'incident', 'cloudflare'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    readTime: 5,
    content: {
      context: 'We use Cloudflare as our CDN to cache static assets and API responses globally. On January 3rd, we deployed a critical security update to our user profile pages. The deployment completed successfully, but users continued to see the old version for 2 hours despite our cache invalidation attempts.',
      problem: 'The root cause was a misconfigured cache invalidation rule. Our deployment script was supposed to purge all cache entries matching the pattern `/api/users/*`, but a typo in the Cloudflare API call used `/api/user/*` (singular) instead. This meant only a small subset of cached responses were invalidated. Additionally, our monitoring didn\'t alert us that cache invalidation had failed - we only discovered the issue when users reported seeing outdated content.',
      resolution: 'Once we identified the issue, we manually purged the entire cache for user-related endpoints. We then fixed the deployment script with the correct cache invalidation pattern. We also implemented automated verification that checks if cache invalidation succeeded and alerts the team if it fails. Going forward, we added integration tests that verify cache invalidation works correctly before deployments.',
      learnings: 'Important lessons: Always verify cache invalidation succeeded - don\'t assume it worked. Use more specific cache keys to enable granular invalidation. Consider using cache tags for better invalidation control. Monitor cache hit rates and stale content reports. We\'ve since added a "verify deployment" step that checks a sample of CDN responses to ensure new content is being served.'
    },
  },
  {
    id: '6',
    title: 'Adopting TypeScript Strict Mode',
    excerpt: 'Our journey to enable strict mode across 200+ TypeScript files and the benefits we realized.',
    category: 'insight',
    author: authors[0],
    team: authors[0].team,
    tags: ['typescript', 'dx', 'code-quality'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    readTime: 10,
    content: {
      context: 'Our codebase had been using TypeScript for 3 years, but we never enabled strict mode. While TypeScript caught some errors, we were missing out on many type safety benefits. With 200+ TypeScript files and a growing team, we decided it was time to enable strict mode to improve code quality and catch bugs earlier.',
      problem: 'Enabling strict mode revealed thousands of type errors across the codebase. Common issues included: Implicit any types in function parameters and return values. Potentially undefined values being accessed without null checks. Unused variables and parameters. Type assertions that were too loose. The migration seemed daunting - we estimated it would take 2-3 months of dedicated effort.',
      resolution: 'We took an incremental approach: First, we enabled strict mode in new files only, requiring all new code to be strict-mode compliant. Then we created a script to gradually migrate existing files, starting with utility functions and working up to complex components. We used TypeScript\'s `// @ts-ignore` sparingly and only as a temporary measure with TODO comments. We also set up CI checks to prevent regressions. The migration took 6 weeks with 2 engineers working part-time on it.',
      learnings: 'The benefits we\'ve seen: Caught 15+ production bugs during development that would have made it to production. Improved IDE autocomplete and refactoring confidence. Better onboarding for new team members - types serve as documentation. Reduced runtime errors by 30% since enabling strict mode. The migration was worth it - the initial effort paid off quickly. Our advice: Start with strict mode from day one, or migrate incrementally but consistently. Don\'t use `any` as a crutch - take time to properly type things.'
    },
  },
];

export const teams = ['All Teams', 'Launch', 'Platform', 'Infrastructure', 'Product', 'API', 'Frontend', 'Mobile'];
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