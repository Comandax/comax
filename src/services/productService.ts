
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types/product";

export const fetchProducts = async (companyId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data || []).map(product => ({
    _id: product.id,
    reference: product.reference,
    name: product.name,
    image: product.image_url,
    sizes: (product.sizes as Array<{size: string; value: number}>), // Explicitly cast the JSON to the correct type
    quantities: product.quantities,
    disabled: product.disabled,
    companyId: product.company_id
  }));
};
