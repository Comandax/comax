import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { productFormSchema } from "@/schemas/productSchema";
import type { Product, ProductFormData } from "@/types/product";
import { useState } from "react";
import { ProductBasicInfo } from "./form/ProductBasicInfo";
import { ProductSizes } from "./form/ProductSizes";
import { ProductQuantities } from "./form/ProductQuantities";

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Product;
  onComplete?: () => void;
}

export function ProductForm({ onSubmit, initialData, onComplete }: ProductFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      reference: initialData?.reference || "",
      name: initialData?.name || "",
      image: initialData?.image || "",
      sizes: initialData?.sizes || [{ size: "", value: 0 }],
      quantities: initialData?.quantities || [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
    },
  });

  const sizeArray = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const quantityArray = useFieldArray<ProductFormData>({
    control: form.control,
    name: "quantities" as const,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const reference = form.getValues('reference');
      
      if (!reference) {
        form.setError('reference', {
          type: 'manual',
          message: 'Please fill in the reference before uploading an image'
        });
        return;
      }

      const fileName = `${reference}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      form.setValue('image', urlData.publicUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      form.setError('image', {
        type: 'manual',
        message: 'Error uploading image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ProductBasicInfo 
          form={form} 
          isUploading={isUploading} 
          onImageUpload={handleImageUpload} 
        />
        
        <ProductSizes 
          form={form} 
          sizeArray={sizeArray} 
        />
        
        <ProductQuantities 
          form={form} 
          quantityArray={quantityArray} 
        />

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
