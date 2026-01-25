import { searchFoods } from '@/services/openFoodFactsService';
import { FoodItem } from '@/types/meal';
import debounce from 'lodash/debounce';
import { useCallback, useMemo, useRef, useState } from 'react';

export const useFoodSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const currentQueryRef = useRef('');

  const performSearch = useCallback(
    async (searchQuery: string, pageNum: number = 1) => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setResults([]);
        setTotal(0);
        setHasMore(false);
        return;
      }

      currentQueryRef.current = searchQuery;
      setIsLoading(true);
      setError(null);

      const { data, error: searchError } = await searchFoods(searchQuery, pageNum);

      if (currentQueryRef.current !== searchQuery) {
        return;
      }

      setIsLoading(false);

      if (searchError) {
        setError(searchError);
        return;
      }

      if (data) {
        setResults(pageNum === 1 ? data.products : [...results, ...data.products]);
        setHasMore(data.hasMore);
        setPage(pageNum);
        setTotal(data.total);
      }
    },
    [results]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        performSearch(q, 1);
      }, 400),
    [performSearch]
  );

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setTotal(0);
        setHasMore(false);
        setError(null);
        return;
      }
      debouncedSearch(searchQuery);
    },
    [debouncedSearch]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && query.trim()) {
      performSearch(query, page + 1);
    }
  }, [query, page, isLoading, hasMore, performSearch]);

  const clear = useCallback(() => {
    debouncedSearch.cancel();
    setQuery('');
    setResults([]);
    setError(null);
    setPage(1);
    setHasMore(false);
    setTotal(0);
    currentQueryRef.current = '';
  }, [debouncedSearch]);

  return {
    query,
    results,
    isLoading,
    error,
    hasMore,
    total,
    search,
    loadMore,
    clear,
  };
};

export default useFoodSearch;
