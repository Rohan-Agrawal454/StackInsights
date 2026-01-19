import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Zap } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchInput } from '@/components/ui/search-input';
import { PostCard } from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Post } from '@/types';
import { getAllPosts, fetchBrowsePage, fetchTeams, fetchCategories } from '@/lib/contentstack-api';
import type { BrowsePageContent, ContentstackTeam, ContentstackCategory } from '@/types/contentstack';
import { useAlgoliaSearch } from '@/hooks/use-algolia-search';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [browseData, setBrowseData] = useState<BrowsePageContent | null>(null);
  const [teams, setTeams] = useState<ContentstackTeam[]>([]);
  const [categories, setCategories] = useState<ContentstackCategory[]>([]);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedTeam, setSelectedTeam] = useState(searchParams.get('team') || 'All Teams');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use Algolia search hook
  const { 
    results: algoliaResults, 
    isSearching
  } = useAlgoliaSearch(search, {
    category: selectedCategory,
    team: selectedTeam,
    tags: selectedTags,
  });

  useEffect(() => {
    getAllPosts().then(setPosts);
    fetchBrowsePage().then(setBrowseData);
    fetchTeams().then(setTeams);
    fetchCategories().then(setCategories);
  }, []);

  // Generate all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    // ONLY use Algolia search - no fallback
    if (search.trim()) {
      return algoliaResults.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // When no search query, show all posts with filters
    return posts
      .filter((post: Post) => {
        const matchesTeam = selectedTeam === 'All Teams' || post.team === selectedTeam;
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => post.tags.includes(tag));
        
        return matchesTeam && matchesCategory && matchesTags;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [posts, search, selectedTeam, selectedCategory, selectedTags, algoliaResults]);

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

  if (!browseData) {
    return null;
  }

  // Extract content from CMS
  const pageTitle = browseData.header.page_title;
  const pageSubtitle = browseData.header.page_subtitle;
  const searchPlaceholder = browseData.search_section.search_placeholder;
  const teamFilterLabel = browseData.search_section.team_filter_label;
  const categoryFilterLabel = browseData.search_section.category_filter_label;
  const allCategoriesText = browseData.search_section.all_categories_text;
  const resultTextSingular = browseData.results_section.result_text_singular;
  const resultTextPlural = browseData.results_section.result_text_plural;
  const clearFiltersButton = browseData.results_section.clear_filters_button;
  const emptyMessage = browseData.empty_state.empty_message;
  const emptyButtonText = browseData.empty_state.empty_button_text;

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">{pageTitle}</h1>
          <p className="mt-2 text-text-secondary">
            {pageSubtitle}
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
            <div className="flex-1 relative">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={searchPlaceholder}
                className="flex-1"
              />
              {search.trim() && !isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md pointer-events-none">
                  <Zap className="h-3 w-3" />
                  <span className="hidden sm:inline">Algolia</span>
                </div>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  Searching...
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-40 bg-card">
                  <SelectValue placeholder={teamFilterLabel} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.uid} value={team.team_name}>{team.team_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-44 bg-card">
                  <SelectValue placeholder={categoryFilterLabel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{allCategoriesText}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.uid} value={cat.category_value}>{cat.category_label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-text-tertiary" />
            {allTags.map((tag: string) => (
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
                {filteredPosts.length} {filteredPosts.length === 1 ? resultTextSingular : resultTextPlural}
              </span>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                <X className="mr-1 h-3 w-3" />
                {clearFiltersButton}
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
            <p className="text-lg text-text-secondary">{emptyMessage}</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              {emptyButtonText}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}