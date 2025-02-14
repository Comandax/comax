
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/productService";

export function useProducts(companyId: string | undefined) {
  const { data: products = [], isLoading: isLoadingProducts, refetch } = useQuery({
    queryKey: ["products", companyId],
    queryFn: () => fetchProducts(companyId || ""),
    enabled: !!companyId,
  });

  return { products, isLoadingProducts, refetch };
}
