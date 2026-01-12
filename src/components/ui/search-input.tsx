import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'default' | 'lg';
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className,
  size = 'default'
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className={cn(
        'absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary',
        size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
      )} />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-card border-border focus-visible:ring-1 focus-visible:ring-ring',
          size === 'lg' ? 'h-12 pl-11 text-base' : 'h-10 pl-9'
        )}
      />
    </div>
  );
}
