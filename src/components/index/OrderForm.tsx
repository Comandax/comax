
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductList } from "@/components/order/ProductList";
import { CompactProductList } from "@/components/order/CompactProductList";
import { ProductSelectQuantityCard } from "@/components/order/ProductSelectQuantityCard";
import type { Product } from "@/types/product";
import type { ResetItem } from "./types";
import { useVirtualPagination } from "@/hooks/useVirtualPagination";
import { useEffect } from "react";

interface OrderFormProps {
  companyId: string;
  displayMode: string;
  quantitySelectionMode?: string;
  products: Product[];
  isLoading?: boolean;
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  onContactSubmit: (data: ContactFormData) => void;
  resetItem?: { productId: string; size: string } | null;
}

const SelectQuantityProductList = ({ products, onQuantitySelect, resetItem, isLoading }: {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { productId: string; size: string } | null;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando produtos...</div>
      </div>
    );
  }

  // Filter out disabled products first
  const availableProducts = products.filter(product => !product.disabled);

  if (availableProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
      </div>
    );
  }

  // Sort products: featured (isNew) first, then by reference
  const sortedProducts = [...availableProducts].sort((a, b) => {
    // First, prioritize featured products
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    
    // Then sort by reference
    return a.reference.localeCompare(b.reference);
  });

  const { displayedItems, hasMore, createObserver } = useVirtualPagination({
    items: sortedProducts,
    initialItemsPerPage: 5,
    itemsPerLoad: 5
  });

  // Set up intersection observer for the penultimate item
  useEffect(() => {
    if (displayedItems.length >= 4 && hasMore) {
      const penultimateIndex = displayedItems.length - 2;
      setTimeout(() => {
        const penultimateElement = document.querySelector(`[data-select-product-index="${penultimateIndex}"]`) as HTMLElement;
        if (penultimateElement) {
          createObserver(penultimateElement);
        }
      }, 100);
    }
  }, [displayedItems.length, hasMore, createObserver]);

  const handleQuantitySelect = (size: string, quantity: number, price: number, productId: string) => {
    onQuantitySelect(productId, size, quantity, price);
  };

  return (
    <div className="space-y-8">
      {displayedItems.map((product, index) => {
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
          isNew: product.isNew,
          outOfStock: product.outOfStock
        };

        return (
          <div key={product._id} data-select-product-index={index}>
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
      
      {hasMore && (
        <div className="flex justify-center py-4">
          <div className="text-sm text-gray-500">Carregando mais produtos...</div>
        </div>
      )}
    </div>
  );
};

export const OrderForm = ({ 
  companyId,
  displayMode,
  quantitySelectionMode = 'radio',
  products, 
  isLoading = false,
  onQuantitySelect,
  onContactSubmit,
  resetItem
}: OrderFormProps) => {
  // Filter out disabled products first
  const availableProducts = products.filter(product => !product.disabled);

  // Sort products: featured (isNew) first, then by reference
  const sortedProducts = [...availableProducts].sort((a, b) => {
    // First, prioritize featured products
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    
    // Then sort by reference
    return a.reference.localeCompare(b.reference);
  });

  return (
    <>
      <ContactForm onSubmit={onContactSubmit} />
      <div className="mt-8">
        {quantitySelectionMode === 'select' ? (
          <SelectQuantityProductList 
            products={sortedProducts} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        ) : displayMode === 'compact' ? (
          <CompactProductList 
            products={sortedProducts} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        ) : (
          <ProductList 
            products={sortedProducts} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
};
