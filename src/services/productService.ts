import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductFormData } from "@/types/product";

export const fetchProducts = async (companyId: string): Promise<Product[]> => {
  console.log('fetchProducts called for companyId:', companyId);
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  console.log('Raw products data from DB:', data);

  const mappedProducts = (data || []).map(product => ({
    _id: product.id,
    reference: product.reference,
    name: product.name,
    image: product.image_url,
    sizes: (product.sizes as Array<{size: string; value: number}>),
    quantities: Array.isArray(product.quantities) 
      ? product.quantities.map(q => typeof q === 'number' ? { value: q } : q)
      : [],
    disabled: product.disabled,
    companyId: product.company_id,
    isNew: product.is_new,
    outOfStock: product.out_of_stock
  }));

  console.log('Mapped products:', mappedProducts);
  return mappedProducts;
};

export const createProduct = async (product: ProductFormData, companyId: string): Promise<Product> => {
  console.log('Creating product:', { product, companyId });
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      reference: product.reference,
      name: product.name,
      image_url: product.image,
      sizes: product.sizes,
      quantities: product.quantities.map(q => q.value),
      company_id: companyId,
      is_new: product.isNew || false,
      out_of_stock: product.outOfStock || false
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
    quantities: data.quantities.map(q => typeof q === 'number' ? { value: q } : q),
    disabled: data.disabled,
    companyId: data.company_id,
    isNew: data.is_new,
    outOfStock: data.out_of_stock
  };
};

export const updateProduct = async (productId: string, product: ProductFormData): Promise<Product> => {
  console.log('Updating product with data:', { productId, product });
  console.log('outOfStock value being sent to DB:', product.outOfStock);
  
  if (!productId) {
    throw new Error('Product ID is required for update');
  }

  const updateData = {
    reference: product.reference,
    name: product.name,
    image_url: product.image,
    sizes: product.sizes,
    quantities: product.quantities.map(q => q.value),
    is_new: product.isNew || false,
    out_of_stock: product.outOfStock || false
  };

  console.log('Final update data being sent:', updateData);

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  console.log('Update response from DB:', data);

  return {
    _id: data.id,
    reference: data.reference,
    name: data.name,
    image: data.image_url,
    sizes: (data.sizes as Array<{size: string; value: number}>),
    quantities: data.quantities.map(q => typeof q === 'number' ? { value: q } : q),
    disabled: data.disabled,
    companyId: data.company_id,
    isNew: data.is_new,
    outOfStock: data.out_of_stock
  };
};

export const toggleProductStatus = async (productId: string, disabled: boolean): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update({ disabled })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }

  return {
    _id: data.id,
    reference: data.reference,
    name: data.name,
    image: data.image_url,
    sizes: (data.sizes as Array<{size: string; value: number}>),
    quantities: data.quantities.map(q => typeof q === 'number' ? { value: q } : q),
    disabled: data.disabled,
    companyId: data.company_id,
    isNew: data.is_new,
    outOfStock: data.out_of_stock
  };
};

export const toggleProductOutOfStock = async (productId: string, outOfStock: boolean): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update({ out_of_stock: outOfStock })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling product out of stock status:', error);
    throw error;
  }

  return {
    _id: data.id,
    reference: data.reference,
    name: data.name,
    image: data.image_url,
    sizes: (data.sizes as Array<{size: string; value: number}>),
    quantities: data.quantities.map(q => typeof q === 'number' ? { value: q } : q),
    disabled: data.disabled,
    companyId: data.company_id,
    isNew: data.is_new,
    outOfStock: data.out_of_stock
  };
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
