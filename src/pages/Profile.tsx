import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Building, Sun, Moon, Edit } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PostCard } from '@/components/posts/PostCard';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/hooks/use-theme';
import { useProfile } from '@/hooks/use-profile';
import { PersonalizationDashboard } from '@/components/PersonalizationDashboard';
import type { Post, Author } from '@/types';
import { getPostsByAuthor, fetchProfilePage, getAuthorById } from '@/lib/contentstack-api';
import type { ProfilePageContent } from '@/types/contentstack';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { currentProfile } = useProfile();
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorPosts, setAuthorPosts] = useState<Post[]>([]);
  const [pageContent, setPageContent] = useState<ProfilePageContent | null>(null);
  
  const isDark = theme === 'dark';
  const isOwnProfile = currentProfile && author && currentProfile.id === author.id;

  useEffect(() => {
    fetchProfilePage().then(setPageContent);
  }, []);

  useEffect(() => {
    if (id) {
      getAuthorById(id).then(setAuthor);
      getPostsByAuthor(id).then(posts => {
        // Sort posts by creation date (oldest first)
        const sortedPosts = [...posts].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setAuthorPosts(sortedPosts);
      });
    }
  }, [id]);

  if (!pageContent) {
    return null;
  }
  
  if (!author) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">{pageContent.not_found.title}</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">{pageContent.not_found.button_text}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {pageContent.navigation.back_button_text}
          </Link>
        </Button>

        {/* Profile header */}
        <div className="mb-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <img
              src={author.avatar}
              alt={author.name}
              className="h-24 w-24 rounded-full object-cover shadow-elevation-md"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary">{author.name}</h1>
                  <p className="mt-1 text-lg text-text-secondary">{author.role}</p>
                </div>
                
                <Toggle
                  pressed={isDark}
                  onPressedChange={() => setTheme(isDark ? 'light' : 'dark')}
                  aria-label={pageContent.profile_header.theme_toggle_label}
                  className="h-10 w-10 rounded-full border border-border bg-card data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Toggle>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-tertiary">
                <div className="flex items-center gap-1.5">
                  <Building className="h-4 w-4" />
                  <span>{author.team}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{author.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{author.name.toLowerCase().replace(' ', '.')}@contentstack.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 max-w-2xl">
            <p className="text-text-secondary leading-relaxed">{author.bio}</p>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-text-primary">{authorPosts.length}</p>
              <p className="text-sm text-text-tertiary">{pageContent.stats_section.posts_label}</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-text-primary">
                {authorPosts.reduce((acc, p) => acc + p.readTime, 0)}
              </p>
              <p className="text-sm text-text-tertiary">{pageContent.stats_section.content_minutes_label}</p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Personalization Dashboard (only for own profile) */}
        {isOwnProfile && (
          <>
            <PersonalizationDashboard />
            <Separator className="my-8" />
          </>
        )}

        {/* Posts */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-text-primary">
            {pageContent.posts_section.section_title_prefix} {author.name.split(' ')[0]}
          </h2>
          
          {authorPosts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map(post => (
                <div key={post.id} className="relative group/card">
                  <PostCard post={post} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      navigate(`/edit/${post.id}`);
                    }}
                    className="absolute top-3 right-3 z-10 h-7 gap-1.5 bg-card/95 backdrop-blur-sm shadow-sm border border-border opacity-0 group-hover/card:opacity-100 transition-all duration-200 hover:bg-accent hover:scale-105 hover:shadow-md"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="text-xs">{pageContent.posts_section.edit_button_text}</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
              <p className="text-text-secondary">{pageContent.posts_section.empty_state_message}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}