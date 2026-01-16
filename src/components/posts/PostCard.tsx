import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import type { Post } from '@/types';
import { getCategoryColor } from '@/lib/category-utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'featured';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group block rounded-xl bg-card shadow-elevation-sm transition-all duration-200 hover:shadow-elevation-lg hover:-translate-y-1 border border-border overflow-hidden"
      >
        {post.featuredImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={cn('font-medium', getCategoryColor(post.category))}>
                {post.categoryLabel}
              </Badge>
              {/* <span className="text-sm text-text-tertiary">{post.team}</span> */}
            </div>
            
            <h3 className="text-xl font-semibold text-text-primary group-hover:text-link transition-colors">
              {post.title}
            </h3>
            
            <p className="text-text-secondary line-clamp-2">{post.excerpt}</p>
            
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-text-primary">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-text-tertiary">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/post/${post.id}`}
        className="group flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
      >
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn('text-xs', getCategoryColor(post.category))}>
              {post.categoryLabel}
            </Badge>
          </div>
          <h4 className="font-medium text-text-primary group-hover:text-link transition-colors line-clamp-2">
            {post.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{post.readTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.id}`}
      className="group block rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-elevation-md hover:border-border/80 hover:-translate-y-0.5 overflow-hidden"
    >
      {post.featuredImage && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge className={cn('font-medium', getCategoryColor(post.category))}>
            {post.categoryLabel}
          </Badge>
          <span className="text-xs text-text-tertiary truncate">{post.team}</span>
        </div>
        
        <h3 className="font-semibold text-text-primary group-hover:text-link transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-sm text-text-secondary line-clamp-2">{post.excerpt}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-5 w-5 rounded-full object-cover shrink-0"
            />
            <span className="text-sm text-text-secondary truncate">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime}m</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
