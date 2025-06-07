
import { Card } from "@/components/ui/card";
import { CompanyInfo } from "@/components/index/CompanyInfo";
import { OrderForm } from "@/components/index/OrderForm";
import type { OrderItem } from "@/types/order";
import type { Product } from "@/types/product";
import type { ContactFormData } from "@/components/ContactForm";

interface IndexContentProps {
  company: any;
  products: Product[];
  isLoadingProducts: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  total: number;
  orderItems: OrderItem[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  resetItem: { productId: string; size: string } | null;
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  onContactSubmit: (data: ContactFormData) => void;
  onSubmitOrder: (notes: string) => Promise<void>;
  onRemoveItem: (productId: string, size: string) => void;
}

export const IndexContent = ({
  company,
  products,
  isLoadingProducts,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  total,
  orderItems,
  isModalOpen,
  setIsModalOpen,
  resetItem,
  onQuantitySelect,
  onContactSubmit,
  onSubmitOrder,
  onRemoveItem
}: IndexContentProps) => {
  return (
    <div className="flex flex-col min-h-screen h-full bg-background">
      <CompanyInfo 
        company={company}
        total={total}
        items={orderItems}
        onSubmitOrder={onSubmitOrder}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRemoveItem={onRemoveItem}
        isCalculating={false}
      />
      
      <div className="container mx-auto px-4 py-2 flex-1 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-center text-onSurfaceVariant">
            Simulações e Pedidos
          </h1>

          <Card className="border-border/30 bg-surfaceContainerLowest shadow-lg backdrop-blur-sm p-8">
            <OrderForm 
              companyId={company.id}
              displayMode={company.display_mode}
              quantitySelectionMode={company.quantity_selection_mode}
              products={products}
              isLoading={isLoadingProducts}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={onLoadMore}
              onQuantitySelect={onQuantitySelect}
              onContactSubmit={onContactSubmit}
              resetItem={resetItem}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
