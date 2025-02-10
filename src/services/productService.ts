
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductSize } from "@/types/product";

export const getProductsByCompanyId = async (companyId: string): Promise<Product[]> => {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId)
    .eq('disabled', false);

  if (productsError) {
    throw productsError;
  }

  return (products || []).map(product => ({
    _id: product.id,
    reference: product.reference,
    name: product.name,
    image: product.image_url,
    sizes: (product.sizes as ProductSize[]) || [],
    quantities: product.quantities || [],
    disabled: product.disabled,
    companyId: product.company_id
  }));
};

// Renaming fetchProducts to match the import in Products.tsx
export const fetchProducts = async (companyId: string): Promise<Product[]> => {
  if (!companyId) return [];
  return getProductsByCompanyId(companyId);
};

