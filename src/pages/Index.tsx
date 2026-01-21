import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, TrendingUp, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { PostCard } from '@/components/posts/PostCard';
import { CategoryCard } from '@/components/posts/CategoryCard';
import type { Post, PostCategory } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHomepage, fetchPersonalizedHomepage, getAllPosts, fetchCategories } from '@/lib/contentstack-api';
import type { HomepageContent, ContentstackCategory } from '@/types/contentstack';
import { useProfile } from '@/hooks/use-profile';
import { getPersonalizedPosts, getUserAttributes } from '@/lib/personalization';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [homepageData, setHomepageData] = useState<HomepageContent | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<ContentstackCategory[]>([]);
  const { currentProfile } = useProfile();
  const navigate = useNavigate();
  
  // Fetch homepage with personalization based on user profile
  useEffect(() => {
    const loadHomepage = async () => {
      if (currentProfile) {
        const userAttrs = getUserAttributes(currentProfile.id);
        
        console.log('👤 Current profile:', currentProfile.name, 'User attributes:', userAttrs);
        
        // If user has behavior data (favorite category), fetch personalized homepage
        if (userAttrs.favourite_category) {
          console.log('🎯 User has behavior data, fetching personalized homepage...');
          const personalizedData = await fetchPersonalizedHomepage(currentProfile.id, {
            team: currentProfile.team,
            reading_frequency: userAttrs.reading_frequency,
            expertise_level: userAttrs.expertise_level,
            favourite_category: userAttrs.favourite_category,
            is_engineering_team_reader: userAttrs.is_engineering_team_reader,
          });
          setHomepageData(personalizedData);
        } else {
          // No behavior yet, fetch default
          console.log('ℹ️ No user behavior yet (no favourite_category), fetching default homepage');
          const defaultData = await fetchHomepage();
          setHomepageData(defaultData);
        }
      } else {
        // No profile selected, fetch default
        console.log('ℹ️ No profile selected, fetching default homepage');
        const defaultData = await fetchHomepage();
        setHomepageData(defaultData);
      }
    };
    
    loadHomepage();
    getAllPosts().then(setAllPosts);
    fetchCategories().then(setCategories);
  }, [currentProfile]);

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
  
  const maxFeaturedPosts = homepageData.featured_posts.max_posts;
  
  const latestPostsTitle = homepageData.latest_posts.title;
  const showSeeAllPosts = homepageData.latest_posts.show_see_all_posts;
  const maxLatestPosts = homepageData.latest_posts.max_posts;
  
  const ctaTitle = homepageData.cta.title;
  const ctaDescription = homepageData.cta.description;
  const ctaButtonText = homepageData.cta.button_text;
  const ctaButtonLink = homepageData.cta.button_link.href;

  // Get personalized posts based on user behavior
  const personalizedPosts = currentProfile 
    ? getPersonalizedPosts(currentProfile.id, allPosts, maxFeaturedPosts)
    : [];
  
  // Get user attributes for recommendation explanation
  const userAttributes = currentProfile ? getUserAttributes(currentProfile.id) : null;
  
  // Generate recommendation reason text
  const getRecommendationReason = () => {
    if (!userAttributes || userAttributes.read_count === 0) {
      return "Recent posts to get you started";
    }
    
    const reasons: string[] = [];
    
    if (userAttributes.favourite_category) {
      reasons.push(`${userAttributes.favourite_category} posts`);
    }
    
    if (userAttributes.is_engineering_team_reader) {
      reasons.push("engineering team content");
    }
    
    if (userAttributes.expertise_level === 'expert') {
      reasons.push("advanced topics");
    }
    
    return reasons.length > 0 
      ? `Based on your interest in ${reasons.join(', ')}`
      : "Based on your reading history";
  };
    
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

      {/* Personalized Posts */}
      {personalizedPosts.length > 0 && (
        <section className="border-t border-border bg-linear-to-b from-muted/30 to-background py-12 md:py-16">
          <div className="container">
            <div className="mb-10">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-4 ring-primary/5">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    Recommended for You
                  </h2>
                  <p className="text-base text-text-secondary">
                    {getRecommendationReason()}
                  </p>
                </div>
              </div>
              
              {/* User Profile Badges */}
              {userAttributes && userAttributes.read_count > 0 && (
                <div className="ml-16 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
                  <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                    Your Profile
                  </span>
                  <div className="h-4 w-px bg-border" />
                  {userAttributes.favourite_category && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20 transition-all hover:bg-primary/15">
                      <span>❤️</span>
                      <span>Loves {userAttributes.favourite_category}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-text-primary ring-1 ring-border capitalize transition-all hover:bg-muted/80">
                    <span>⭐</span>
                    <span>{userAttributes.expertise_level}</span>
                  </span>
                  {userAttributes.is_engineering_team_reader && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent ring-1 ring-accent/20 transition-all hover:bg-accent/15">
                      <span>🚀</span>
                      <span>Engineering Reader</span>
                    </span>
                  )}
                  <span className="ml-auto text-xs text-text-tertiary">
                    {userAttributes.read_count} {userAttributes.read_count === 1 ? 'post' : 'posts'} read
                  </span>
                </div>
              )}
            </div>
            
            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {personalizedPosts.map((post: Post) => (
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