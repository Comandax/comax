
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { InfiniteProductList } from "@/components/order/InfiniteProductList";
import { InfiniteCompactProductList } from "@/components/order/InfiniteCompactProductList";
import { InfiniteSelectQuantityProductList } from "@/components/order/InfiniteSelectQuantityProductList";
import type { Product } from "@/types/product";

interface OrderFormProps {
  companyId: string;
  displayMode: string;
  quantitySelectionMode?: string;
  products: Product[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  onContactSubmit: (data: ContactFormData) => void;
  resetItem?: { productId: string; size: string } | null;
}

export const OrderForm = ({ 
  companyId,
  displayMode,
  quantitySelectionMode = 'radio',
  products, 
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  onQuantitySelect,
  onContactSubmit,
  resetItem
}: OrderFormProps) => {
  return (
    <>
      <ContactForm onSubmit={onContactSubmit} />
      <div className="mt-8">
        {quantitySelectionMode === 'select' ? (
          <InfiniteSelectQuantityProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onLoadMore={onLoadMore}
          />
        ) : displayMode === 'compact' ? (
          <InfiniteCompactProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onLoadMore={onLoadMore}
          />
        ) : (
          <InfiniteProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onLoadMore={onLoadMore}
          />
        )}
      </div>
    </>
  );
};
