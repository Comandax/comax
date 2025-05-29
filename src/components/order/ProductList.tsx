
import { ProductSelectionCard } from "./ProductSelectionCard";
import { ProductSelectQuantityCard } from "./ProductSelectQuantityCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";
import type { ResetItem } from "../index/types";

interface ProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem: ResetItem | null;
  isLoading?: boolean;
}

export const ProductList = ({ 
  products, 
  onQuantitySelect, 
  resetItem, 
  isLoading = false 
}: ProductListProps) => {
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

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatProductData = (product: Product) => ({
    id: product._id,
    name: product.name,
    image: product.image || "",
    ref: product.reference,
    isNew: product.isNew,
    sizes: product.sizes.map(size => ({
      label: size.size,
      price: size.value,
      quantities: product.quantities.map(q => q.value)
    }))
  });

  // Filtra produtos ativos e ordena colocando lançamentos primeiro
  const sortedProducts = products
    .filter(product => !product.disabled)
    .sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.reference.localeCompare(b.reference);
    });

  return (
    <div className="grid gap-6">
      {sortedProducts.map((product) => {
        const formattedProduct = formatProductData(product);
        const ProductComponent = quantitySelectionMode === 'select' 
          ? ProductSelectQuantityCard 
          : ProductSelectionCard;
        
        return (
          <ProductComponent
            key={product._id}
            product={formattedProduct}
            onQuantitySelect={(size, quantity, price) => 
              onQuantitySelect(product._id, size, quantity, price)
            }
            resetItem={resetItem}
          />
        );
      })}
    </div>
  );
};
