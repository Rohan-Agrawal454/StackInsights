import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PostCard } from '@/components/posts/PostCard';
import { posts, getCategoryLabel, getCategoryColor, type Post } from '@/lib/data';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find((p: Post) => p.id === id);
  
  if (!post) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">Post not found</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedPosts = posts
    .filter((p: Post) => p.id !== post.id && (p.category === post.category || p.team === post.team))
    .slice(0, 3);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-text-tertiary">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/browse" className="hover:text-text-primary transition-colors">Browse</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-text-secondary truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Back button */}
          <Button variant="ghost" asChild className="mb-6 -ml-2">
            <Link to="/browse">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </Button>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryLabel(post.category)}
              </Badge>
              <span className="text-sm text-text-tertiary">{post.team}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
              {post.title}
            </h1>
            
            <p className="mt-4 text-lg text-text-secondary">{post.excerpt}</p>

            {/* Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-tertiary">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <Link 
                    to={`/profile/${post.author.id}`}
                    className="font-medium text-text-primary hover:text-link transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <p className="text-xs">{post.author.role} · {post.team}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-text-tertiary" />
              {post.tags.map((tag: string) => (
                <Link key={tag} to={`/browse?tag=${tag}`}>
                  <Badge variant="secondary" className="hover:bg-accent/10 transition-colors">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </header>

          <Separator className="my-8" />

          {/* Content - Structured sections */}
          <div className="prose-stack">
            <section>
              <h2>Context</h2>
              <p>
                This document outlines the key details and background information relevant to this {getCategoryLabel(post.category).toLowerCase()}. 
                Understanding the context is crucial for appreciating the decisions made and lessons learned.
              </p>
              <p>
                Our team has been working on improving system reliability and performance. 
                This particular case provides valuable insights into our approach and outcomes.
              </p>
            </section>

            <section>
              <h2>Problem Statement</h2>
              <p>
                The core challenge we faced involved multiple interconnected systems and required careful analysis 
                to identify the root cause. Initial symptoms were subtle but grew more pronounced over time.
              </p>
              <ul>
                <li>First observed on routine monitoring dashboards</li>
                <li>Customer reports began trickling in shortly after</li>
                <li>Full scope became clear during investigation</li>
              </ul>
            </section>

            <section>
              <h2>Resolution</h2>
              <p>
                After thorough investigation and collaborative problem-solving, we implemented a multi-faceted solution:
              </p>
              <pre><code>{`// Example configuration change
{
  "connectionPool": {
    "maxSize": 50,
    "minSize": 10,
    "idleTimeout": 30000
  }
}`}</code></pre>
              <p>
                The fix was deployed in stages, with careful monitoring at each step to ensure stability.
              </p>
            </section>

            <section>
              <h2>Key Learnings</h2>
              <p>
                This experience reinforced several important principles that we'll carry forward:
              </p>
              <ol>
                <li><strong>Proactive monitoring</strong> - Early detection saves significant time and resources</li>
                <li><strong>Clear communication</strong> - Keeping stakeholders informed reduces confusion</li>
                <li><strong>Documentation</strong> - Writing things down helps future troubleshooting</li>
                <li><strong>Blameless culture</strong> - Focus on systems, not individuals</li>
              </ol>
              <blockquote>
                "Every incident is an opportunity to make our systems more resilient."
              </blockquote>
            </section>
          </div>

          <Separator className="my-8" />

          {/* Author card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">{post.author.name}</h3>
                <p className="text-sm text-text-secondary">{post.author.role} · {post.author.team}</p>
                <p className="mt-2 text-sm text-text-secondary">{post.author.bio}</p>
                <Button variant="outline" size="sm" asChild className="mt-3">
                  <Link to={`/profile/${post.author.id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-12">
          <div className="container">
            <h2 className="mb-6 text-xl font-semibold text-text-primary">Related Posts</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}