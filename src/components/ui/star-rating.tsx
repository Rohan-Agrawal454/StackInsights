import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Handle half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const isFilled = i < fullStars;
        const isHalf = i === fullStars && hasHalfStar;
        
        return (
          <div key={i} className="relative">
            {isHalf ? (
              <>
                <Star className={cn(sizeClasses[size], 'fill-none text-gray-300')} />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
                </div>
              </>
            ) : (
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300'
                )}
              />
            )}
          </div>
        );
      })}
      {showValue && rating > 0 && (
        <span className="ml-1 text-sm text-text-secondary font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
