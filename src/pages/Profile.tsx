import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Building, Sun, Moon, Edit } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PostCard } from '@/components/posts/PostCard';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/hooks/use-theme';
import { authors, posts } from '@/lib/data';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const author = authors.find(a => a.id === id);
  
  const isDark = theme === 'dark';
  
  if (!author) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">Author not found</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const authorPosts = posts.filter(p => p.author.id === author.id);

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/browse">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
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
                  aria-label="Toggle dark mode"
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
              <p className="text-sm text-text-tertiary">Posts</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center">
              <p className="text-2xl font-semibold text-text-primary">
                {authorPosts.reduce((acc, p) => acc + p.readTime, 0)}
              </p>
              <p className="text-sm text-text-tertiary">Min of content</p>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Posts */}
        <div>
          <h2 className="mb-6 text-xl font-semibold text-text-primary">
            Posts by {author.name.split(' ')[0]}
          </h2>
          
          {authorPosts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map(post => (
                <div key={post.id} className="relative">
                  <PostCard post={post} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      navigate(`/edit/${post.id}`);
                    }}
                    className="absolute top-3 right-3 z-10 h-7 gap-1.5 bg-card/95 backdrop-blur-sm shadow-sm hover:bg-card border border-border"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span className="text-xs">Edit</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
              <p className="text-text-secondary">No posts yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}