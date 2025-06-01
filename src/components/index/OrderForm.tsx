
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductList } from "@/components/order/ProductList";
import { CompactProductList } from "@/components/order/CompactProductList";
import { ProductSelectQuantityCard } from "@/components/order/ProductSelectQuantityCard";
import type { Product } from "@/types/product";
import type { ResetItem } from "./types";

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

  if (products.length === 0) {
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
      {products.map((product) => {
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

        return (
          <ProductSelectQuantityCard
            key={product._id}
            product={productForCard}
            onQuantitySelect={(size, quantity, price) => 
              handleQuantitySelect(size, quantity, price, product._id)
            }
            resetItem={resetItem && resetItem.productId === product._id ? 
              { size: resetItem.size, productId: resetItem.productId } : undefined
            }
          />
        );
      })}
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
  return (
    <>
      <ContactForm onSubmit={onContactSubmit} />
      <div className="mt-8">
        {quantitySelectionMode === 'select' ? (
          <SelectQuantityProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        ) : displayMode === 'compact' ? (
          <CompactProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        ) : (
          <ProductList 
            products={products} 
            onQuantitySelect={onQuantitySelect}
            resetItem={resetItem}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
};
