import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { PostCard } from '@/components/posts/PostCard';
import { CategoryCard } from '@/components/posts/CategoryCard';
import type { Post, PostCategory } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHomepage, getAllPosts, getFeaturedPosts, fetchCategories } from '@/lib/contentstack-api';
import type { HomepageContent, ContentstackCategory } from '@/types/contentstack';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [homepageData, setHomepageData] = useState<HomepageContent | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<ContentstackCategory[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchHomepage().then(setHomepageData);
    getAllPosts().then(setAllPosts);
    getFeaturedPosts().then(setFeaturedPosts);
    fetchCategories().then(setCategories);
  }, []);

  const categoryCounts = useMemo(() => {
    return categories.reduce((acc: Record<string, number>, cat) => {
      acc[cat.category_value] = allPosts.filter((p: Post) => p.category === cat.category_value).length;
      return acc;
    }, {} as Record<string, number>);
  }, [categories, allPosts]);

  if (!homepageData) {
    return null;
  }

  // Extract all content from CMS
  const heroTitle = homepageData.hero.title;
  const heroTitleHighlight = homepageData.hero.title_highlight;
  const heroSubtitle = homepageData.hero.subtitle;
  const searchPlaceholder = homepageData.hero.search_placeholder;
  
  const totalPosts = homepageData.stats.total_post;
  const totalContributors = homepageData.stats.total_contributors;
  const totalTeams = homepageData.stats.total_teams;
  
  const categoriesTitle = homepageData.categories.title;
  const showViewAllLink = homepageData.categories.show_view_all_link;
  
  const featuredPostsTitle = homepageData.featured_posts.title;
  const maxFeaturedPosts = homepageData.featured_posts.max_posts;
  
  const latestPostsTitle = homepageData.latest_posts.title;
  const showSeeAllPosts = homepageData.latest_posts.show_see_all_posts;
  const maxLatestPosts = homepageData.latest_posts.max_posts;
  
  const ctaTitle = homepageData.cta.title;
  const ctaDescription = homepageData.cta.description;
  const ctaButtonText = homepageData.cta.button_text;
  const ctaButtonLink = homepageData.cta.button_link.href;

  const displayFeaturedPosts = featuredPosts.slice(0, maxFeaturedPosts);
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxLatestPosts);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border bg-linear-to-b from-muted/50 to-background">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              {heroTitle}
              <br />
              <span className="text-accent">{heroTitleHighlight}</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary md:text-xl">
              {heroSubtitle}
            </p>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="mt-8 flex justify-center">
              <div className="w-full max-w-xl">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                  size="lg"
                  className="w-full"
                />
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <BookOpen className="h-4 w-4" />
                <span><strong className="text-text-primary">{totalPosts}</strong> Posts</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Users className="h-4 w-4" />
                <span><strong className="text-text-primary">{totalContributors}</strong> Contributors</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <TrendingUp className="h-4 w-4" />
                <span><strong className="text-text-primary">{totalTeams}</strong> Teams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary">{categoriesTitle}</h2>
            {showViewAllLink && (
              <Button variant="ghost" asChild className="text-text-secondary">
                <Link to="/browse">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard 
                key={cat.uid} 
                category={cat.category_value as PostCategory} 
                count={categoryCounts[cat.category_value] || 0} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {displayFeaturedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <div className="container">
            <h2 className="mb-8 text-2xl font-semibold text-text-primary">{featuredPostsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {displayFeaturedPosts.map((post: Post) => (
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
            <h2 className="text-2xl font-semibold text-text-primary">{latestPostsTitle}</h2>
            {showSeeAllPosts && (
              <Button variant="ghost" asChild className="text-text-secondary">
                <Link to="/browse">
                  See all posts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-semibold text-text-primary md:text-3xl">
            {ctaTitle}
          </h2>
          <p className="mt-3 text-text-secondary">
            {ctaDescription}
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to={ctaButtonLink}>{ctaButtonText}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}