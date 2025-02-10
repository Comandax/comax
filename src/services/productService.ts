
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

interface ProductSize {
  size: string;
  value: number;
}

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
    sizes: ((product.sizes || []) as ProductSize[]).map(size => ({
      label: size.size,
      price: size.value,
      quantities: [0, ...(product.quantities || [])],
    })),
    disabled: product.disabled,
    companyId: product.company_id
  }));
};

