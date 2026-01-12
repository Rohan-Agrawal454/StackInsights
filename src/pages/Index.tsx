import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { PostCard } from '@/components/posts/PostCard';
import { CategoryCard } from '@/components/posts/CategoryCard';
import { posts, categories, type Post, type PostCategory } from '@/lib/data';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const featuredPosts = posts.filter((p: Post) => p.featured);
  const latestPosts = posts.slice(0, 4);
  
  const categoryCounts = categories.reduce((acc: Record<string, number>, cat: PostCategory) => {
    acc[cat] = posts.filter((p: Post) => p.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Share Knowledge,
              <br />
              <span className="text-accent">Learn Together</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary md:text-xl">
              Discover insights, incident reports, and retrospectives from teams across the organization.
              Build on each other's experiences.
            </p>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="mt-8 flex justify-center">
              <div className="w-full max-w-xl">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search for posts, topics, or authors..."
                  size="lg"
                  className="w-full"
                />
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <BookOpen className="h-4 w-4" />
                <span><strong className="text-text-primary">{posts.length}</strong> Posts</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Users className="h-4 w-4" />
                <span><strong className="text-text-primary">4</strong> Contributors</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp className="h-4 w-4" />
                <span><strong className="text-text-primary">5</strong> Teams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary">Browse by Category</h2>
            <Button variant="ghost" asChild className="text-text-secondary">
              <Link to="/browse">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: PostCategory) => (
              <CategoryCard key={category} category={category} count={categoryCounts[category]} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container">
            <h2 className="mb-8 text-2xl font-semibold text-text-primary">Featured</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {featuredPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary">Latest Posts</h2>
            <Button variant="ghost" asChild className="text-text-secondary">
              <Link to="/browse">
                See all posts <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-semibold text-primary-foreground md:text-3xl">
            Have something to share?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Every insight, incident, and retrospective helps the team grow.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/create">Create a Post</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}