import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, Info, AlertCircle, CheckCircle, Target, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PostCard } from '@/components/posts/PostCard';
import { posts, getCategoryLabel, getCategoryColor, type Post } from '@/lib/data';
import { cn } from '@/lib/utils';

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
          <div className="space-y-6">
            {post.content.context && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", getCategoryColor(post.category))}>
                    <Info className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Context</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.context}</p>
                </div>
              </section>
            )}

            {post.content.problem && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-incident/10">
                    <AlertCircle className="h-5 w-5 text-incident" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Problem Statement</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.problem}</p>
                </div>
              </section>
            )}

            {post.content.resolution && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-retro/10">
                    <CheckCircle className="h-5 w-5 text-retro" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Resolution</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.resolution}</p>
                </div>
              </section>
            )}

            {post.content.achievements && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-insight/10">
                    <Target className="h-5 w-5 text-insight" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Achievements</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.achievements}</p>
                </div>
              </section>
            )}

            {post.content.challenges && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <TrendingUp className="h-5 w-5 text-text-secondary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Challenges</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.challenges}</p>
                </div>
              </section>
            )}

            {post.content.improvements && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Improvements</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.improvements}</p>
                </div>
              </section>
            )}

            {post.content.learnings && (
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Lightbulb className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-text-primary">Key Learnings</h2>
                </div>
                <div className="prose-stack">
                  <p className="text-text-secondary leading-relaxed">{post.content.learnings}</p>
                </div>
              </section>
            )}
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