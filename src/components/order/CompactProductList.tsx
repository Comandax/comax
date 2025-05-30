
import { useState } from "react";
import { Loader, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductDetailsDialog } from "./ProductDetailsDialog";

interface CompactProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { size: string; productId: string; };
  isLoading?: boolean;
}

export function CompactProductList({ 
  products, 
  onQuantitySelect, 
  resetItem, 
  isLoading = false 
}: CompactProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, Record<string, number>>>({});
  
  const companyId = products[0]?.companyId;

  const { data: company } = useQuery({
    queryKey: ['company-config', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (error) {
        console.error('Error fetching company config:', error);
        return null;
      }
      return data;
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const quantitySelectionMode = (company as any)?.quantity_selection_mode || 'radio';

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuantityChange = (size: string, quantity: number, price: number) => {
    if (!selectedProduct) return;

    setSelectedQuantities(prev => ({
      ...prev,
      [selectedProduct._id]: {
        ...(prev[selectedProduct._id] || {}),
        [size]: quantity
      }
    }));

    onQuantitySelect(selectedProduct._id, size, quantity, price);
  };

  const hasProductInCart = (productId: string) => {
    const productQuantities = selectedQuantities[productId];
    if (!productQuantities) return false;
    return Object.values(productQuantities).some(quantity => quantity > 0);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const activeProducts = products
    .filter(product => !product.disabled)
    .sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.reference.localeCompare(b.reference);
    });

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <Loader className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
        <h3 className="mt-4 text-sm font-semibold text-gray-900">Carregando produtos...</h3>
      </div>
    );
  }

  if (!activeProducts.length) {
    return (
      <div className="text-center p-8">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum produto disponível</h3>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activeProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onSelect={handleProductClick}
            hasInCart={hasProductInCart(product._id)}
          />
        ))}
      </div>

      <ProductDetailsDialog
        product={selectedProduct}
        onClose={handleCloseDialog}
        onQuantitySelect={handleQuantityChange}
        selectedQuantities={selectedProduct ? selectedQuantities[selectedProduct._id] || {} : {}}
        quantitySelectionMode={quantitySelectionMode}
        resetItem={resetItem && selectedProduct && resetItem.productId === selectedProduct._id ? resetItem : undefined}
      />
    </>
  );
}
