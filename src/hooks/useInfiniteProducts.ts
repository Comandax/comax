
import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/product';

const PRODUCTS_PER_PAGE = 5;

const fetchProductsPage = async (companyId: string, page: number): Promise<Product[]> => {
  console.log('Fetching products page:', page, 'for company:', companyId);
  
  const from = page * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId)
    .eq('disabled', false)
    .order('is_new', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching products page:', error);
    throw error;
  }

  const mappedProducts = (data || []).map(product => ({
    _id: product.id,
    reference: product.reference,
    name: product.name,
    image: product.image_url,
    sizes: (product.sizes as Array<{size: string; value: number}>),
    quantities: Array.isArray(product.quantities) 
      ? product.quantities.map(q => typeof q === 'number' ? { value: q } : q)
      : [],
    disabled: product.disabled,
    companyId: product.company_id,
    isNew: product.is_new,
    outOfStock: product.out_of_stock
  }));

  console.log('Mapped products for page', page, ':', mappedProducts);
  return mappedProducts;
};

export function useInfiniteProducts(companyId: string | undefined) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['infinite-products', companyId],
    queryFn: ({ pageParam = 0 }) => {
      console.log('Fetching page:', pageParam);
      return fetchProductsPage(companyId || '', pageParam);
    },
    enabled: !!companyId,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PRODUCTS_PER_PAGE) {
        return undefined;
      }
      return allPages.length;
    },
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (data) {
      const flatProducts = data.pages.flat();
      console.log('All products updated:', flatProducts.length);
      setAllProducts(flatProducts);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      console.log('Loading more products...');
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    products: allProducts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    error,
  };
}
