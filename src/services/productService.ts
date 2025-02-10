
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductFormData } from "@/types/product";

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
    sizes: (product.sizes as Array<{size: string; value: number}>),
    quantities: product.quantities,
    disabled: product.disabled,
    companyId: product.company_id
  }));
};

export const createProduct = async (product: ProductFormData, companyId: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      reference: product.reference,
      name: product.name,
      image_url: product.image,
      sizes: product.sizes as Array<{size: string; value: number}>,
      quantities: product.quantities,
      company_id: companyId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return {
    _id: data.id,
    reference: data.reference,
    name: data.name,
    image: data.image_url,
    sizes: (data.sizes as Array<{size: string; value: number}>),
    quantities: data.quantities,
    disabled: data.disabled,
    companyId: data.company_id
  };
};
