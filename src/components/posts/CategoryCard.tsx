import { Link } from 'react-router-dom';
import { Lightbulb, AlertTriangle, RotateCcw } from 'lucide-react';
import type { PostCategory } from '@/types';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';
import type { SVGProps } from 'react';

interface CategoryCardProps {
  category: PostCategory;
  count: number;
}

const categoryConfig: Record<PostCategory, { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; description: string; colorClass: string }> = {
  insight: {
    icon: Lightbulb,
    label: 'Insights',
    description: 'Technical learnings and best practices',
    colorClass: 'bg-insight/10 text-insight border-insight/20',
  },
  incident: {
    icon: AlertTriangle,
    label: 'Incidents',
    description: 'Post-mortems and failure analysis',
    colorClass: 'bg-incident/10 text-incident border-incident/20',
  },
  retrospective: {
    icon: RotateCcw,
    label: 'Retrospectives',
    description: 'Team reflections and improvements',
    colorClass: 'bg-retro/10 text-retro border-retro/20',
  },
};

export function CategoryCard({ category, count }: CategoryCardProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Link
      to={`/browse?category=${category}`}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border p-5 transition-all hover:shadow-elevation-sm',
        config.colorClass
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', config.colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-2xl font-semibold">{count}</span>
      </div>
      <div>
        <h3 className="font-semibold">{config.label}</h3>
        <p className="text-sm opacity-80">{config.description}</p>
      </div>
    </Link>
  );
}
