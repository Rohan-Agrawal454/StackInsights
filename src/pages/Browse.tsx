import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchInput } from '@/components/ui/search-input';
import { PostCard } from '@/components/posts/PostCard';
// import { CategoryCard } from '@/components/posts/CategoryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { posts, teams, categories, allTags, getCategoryLabel, type PostCategory, type Post } from '@/lib/data';

export default function Browse() {
//   const categoryCounts = categories.reduce((acc: Record<string, number>, cat: PostCategory) => {
//     acc[cat] = posts.filter((p: Post) => p.category === cat).length;
//     return acc;
//   }, {} as Record<string, number>);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get('team') || 'All Teams');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post: Post) => {
      const matchesSearch = !search || 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.author.name.toLowerCase().includes(search.toLowerCase());
      
      const matchesTeam = selectedTeam === 'All Teams' || post.team === selectedTeam;
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => post.tags.includes(tag));
      
      return matchesSearch && matchesTeam && matchesCategory && matchesTags;
    });
  }, [search, selectedTeam, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedTeam('All Teams');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedTeam !== 'All Teams' || 
    selectedCategory !== 'all' || selectedTags.length > 0;

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Browse Posts</h1>
          <p className="mt-2 text-text-secondary">
            Explore insights, incidents, and retrospectives from across the organization.
          </p>
        </div>

        {/* Categories */}
        {/* <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category: PostCategory) => (
              <CategoryCard key={category} category={category} count={categoryCounts[category]} />
            ))}
          </div>
        </div> */}

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search and main filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search posts..."
              className="flex-1"
            />
            <div className="flex gap-2">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-40 bg-card">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team: string) => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-44 bg-card">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat: PostCategory) => (
                    <SelectItem key={cat} value={cat}>{getCategoryLabel(cat as PostCategory)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-text-tertiary" />
            {allTags.slice(0, 12).map((tag: string) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-tertiary">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                <X className="mr-1 h-3 w-3" />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-text-secondary">No posts found matching your filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}