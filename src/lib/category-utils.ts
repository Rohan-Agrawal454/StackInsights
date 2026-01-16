/**
 * Category utility functions
 */
import type { PostCategory } from '@/types';

/**
 * Get Tailwind CSS classes for category badge styling
 */
export function getCategoryColor(category: PostCategory): string {
  const colors: Record<PostCategory, string> = {
    insight: 'bg-insight/10 text-insight',
    incident: 'bg-incident/10 text-incident',
    retrospective: 'bg-retro/10 text-retro',
  };
  return colors[category];
}
