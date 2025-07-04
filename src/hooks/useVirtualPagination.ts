
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVirtualPaginationProps<T> {
  items: T[];
  initialItemsPerPage?: number;
  itemsPerLoad?: number;
}

export function useVirtualPagination<T>({
  items,
  initialItemsPerPage = 5,
  itemsPerLoad = 5
}: UseVirtualPaginationProps<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize displayed items
  useEffect(() => {
    const initial = items.slice(0, initialItemsPerPage);
    setDisplayedItems(initial);
    setCurrentIndex(initialItemsPerPage);
    setHasMore(items.length > initialItemsPerPage);
  }, [items, initialItemsPerPage]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;

    const nextItems = items.slice(currentIndex, currentIndex + itemsPerLoad);
    if (nextItems.length > 0) {
      setDisplayedItems(prev => [...prev, ...nextItems]);
      setCurrentIndex(prev => prev + itemsPerLoad);
      setHasMore(currentIndex + itemsPerLoad < items.length);
    } else {
      setHasMore(false);
    }
  }, [items, currentIndex, itemsPerLoad, hasMore]);

  const createObserver = useCallback((element: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!element || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observerRef.current.observe(element);
  }, [loadMore, hasMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    displayedItems,
    hasMore,
    loadMore,
    createObserver
  };
}
