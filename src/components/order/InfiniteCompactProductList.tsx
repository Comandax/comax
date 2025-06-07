
import { ProductSelectionCard } from "./ProductSelectionCard";
import type { Product } from "@/types/product";
import { LoadingState } from "@/components/index/LoadingState";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface InfiniteCompactProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { productId: string; size: string } | null;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
}

export const InfiniteCompactProductList = ({ 
  products, 
  onQuantitySelect, 
  resetItem, 
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore
}: InfiniteCompactProductListProps) => {
  const loadMoreRef = useIntersectionObserver({
    onIntersect: onLoadMore,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
      </div>
    );
  }

  const handleQuantitySelect = (size: string, quantity: number, price: number, productId: string) => {
    onQuantitySelect(productId, size, quantity, price);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const productForCard = {
            id: product._id,
            name: product.name,
            image: product.image || "",
            ref: product.reference,
            sizes: product.sizes.map(size => ({
              label: size.size,
              price: size.value,
              quantities: product.quantities.map(q => q.value)
            })),
            outOfStock: product.outOfStock
          };

          const isSecondToLast = index === products.length - 2;

          return (
            <div key={product._id} ref={isSecondToLast ? loadMoreRef : null}>
              <ProductSelectionCard
                product={productForCard}
                onQuantitySelect={(size, quantity, price) => 
                  handleQuantitySelect(size, quantity, price, product._id)
                }
                resetItem={resetItem && resetItem.productId === product._id ? 
                  { size: resetItem.size, productId: resetItem.productId } : undefined
                }
              />
            </div>
          );
        })}
      </div>
      
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">Carregando mais produtos...</div>
        </div>
      )}
      
      {!hasNextPage && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Todos os produtos foram carregados.</p>
        </div>
      )}
    </div>
  );
};
