
import { ProductSelectQuantityCard } from "./ProductSelectQuantityCard";
import type { Product } from "@/types/product";
import { LoadingState } from "@/components/index/LoadingState";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface InfiniteSelectQuantityProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { productId: string; size: string } | null;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
}

export const InfiniteSelectQuantityProductList = ({ 
  products, 
  onQuantitySelect, 
  resetItem, 
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore
}: InfiniteSelectQuantityProductListProps) => {
  const loadMoreRef = useIntersectionObserver({
    onIntersect: onLoadMore,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando produtos...</div>
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
    <div className="space-y-8">
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
          isNew: product.isNew
        };

        const isSecondToLast = index === products.length - 2;

        return (
          <div key={product._id} ref={isSecondToLast ? loadMoreRef : null}>
            <ProductSelectQuantityCard
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
