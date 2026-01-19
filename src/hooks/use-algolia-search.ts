import { useState, useEffect } from 'react';
import { algoliasearch } from 'algoliasearch';
import type { Post, Author } from '@/types';

const APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID;
const SEARCH_API_KEY = import.meta.env.VITE_ALGOLIA_SEARCH_API_KEY;
const INDEX_NAME = 'stackinsights_posts';

interface SearchFilters {
  category?: string;
  team?: string;
  tags?: string[];
}

export function useAlgoliaSearch(query: string, filters: SearchFilters = {}) {
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if Algolia is configured
    setIsConfigured(Boolean(APP_ID && SEARCH_API_KEY));
  }, []);

  useEffect(() => {
    if (!isConfigured || !query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      setError(null);

      try {
        const client = algoliasearch(APP_ID, SEARCH_API_KEY);
        const index = client.searchSingleIndex({
          indexName: INDEX_NAME,
          searchParams: {
            query,
            hitsPerPage: 100,
          },
        });

        const { hits } = await index;

        // Transform Algolia results to Post format using author data from Algolia
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const posts: Post[] = hits.map((hit: any) => {
          // Extract author from Algolia (now populated)
          const authorData = Array.isArray(hit.author_id) && hit.author_id.length > 0
            ? hit.author_id[0]
            : null;

          const author: Author = authorData ? {
            id: authorData.author_id?.toString() || authorData.uid || '1',
            name: authorData.full_name || 'Unknown Author',
            role: authorData.role || '',
            team: authorData.team?.[0]?.team_name || '',
            location: authorData.location || '',
            avatar: authorData.avatar?.url || '',
            bio: authorData.bio || '',
          } : {
            id: '1',
            name: 'Unknown Author',
            role: '',
            team: '',
            location: '',
            avatar: '',
            bio: '',
          };

          return {
            id: hit.uid || hit.objectID,
            uid: hit.uid,
            title: hit.title_post || hit.title || 'Untitled',
            excerpt: hit.excerpt || '',
            content: hit.content || {
              context: '',
              problem: '',
              resolution: '',
              learnings: '',
              achievements: '',
              challenges: '',
              improvements: '',
            },
            category: hit.category || 'Insight',
            categoryLabel: hit.category || 'Insight',
            tags: Array.isArray(hit.tags_post) 
              ? hit.tags_post 
              : typeof hit.tags_post === 'string'
              ? hit.tags_post.split('\n').filter(Boolean)
              : [],
            author,
            team: author.team,
            createdAt: hit.created_at || new Date().toISOString(),
            updatedAt: hit.updated_at || new Date().toISOString(),
            readTime: hit.read_time || 5,
            featured: hit.featured || false,
            featuredImage: hit.featured_image?.url || hit.featured_image,
            rating: hit.rating?.value || hit.rating,
          };
        });

        // Apply client-side filters
        let filtered = posts;

        if (filters.category && filters.category !== 'all') {
          filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters.team && filters.team !== 'All Teams') {
          filtered = filtered.filter(p => p.team === filters.team);
        }

        const tagsToFilter = filters.tags || [];
        if (tagsToFilter.length > 0) {
          filtered = filtered.filter(p => 
            tagsToFilter.some(tag => p.tags.includes(tag))
          );
        }

        // Remove duplicates based on uid
        const uniquePosts = Array.from(
          new Map(filtered.map(post => [post.uid || post.id, post])).values()
        );

        setResults(uniquePosts);
      } catch (err) {
        console.error('Algolia search error:', err);
        setError('Search failed. Please try again.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    search();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters.category, filters.team, JSON.stringify(filters.tags), isConfigured]);

  return {
    results,
    isSearching,
    error,
    isConfigured,
  };
}
