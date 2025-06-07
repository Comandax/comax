
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";

export function useProducts(companyId: string | undefined) {
  const { data: products = [], isLoading: isLoadingProducts, refetch } = useQuery({
    queryKey: ["products", companyId],
    queryFn: () => {
      console.log('Fetching products for company:', companyId);
      return fetchProducts(companyId || "");
    },
    enabled: !!companyId,
    staleTime: 0, // Always consider data stale to ensure fresh data
    gcTime: 0, // Don't cache data for long
  });

  console.log('useProducts hook - products:', products);

  return { products, isLoadingProducts, refetch };
}
