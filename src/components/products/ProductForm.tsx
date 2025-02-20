
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
  onSubmit: (data: ProductFormData, isEditing: boolean) => Promise<void>;
  initialData?: Product;
  onComplete?: () => void;
}

export function ProductForm({ onSubmit, initialData, onComplete }: ProductFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = Boolean(initialData?._id);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      _id: initialData?._id,
      reference: initialData?.reference || "",
      name: initialData?.name || "",
      image: initialData?.image || "",
      isNew: initialData?.isNew || false,
      sizes: initialData?.sizes || [{ size: "", value: 0 }],
      quantities: initialData?.quantities 
        ? initialData.quantities.map(q => typeof q === 'number' ? { value: q } : q)
        : [
            { value: 5 },
            { value: 10 },
          ],
    },
  });

  const sizeArray = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  const quantityArray = useFieldArray({
    control: form.control,
    name: "quantities",
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
          message: 'Por favor, preencha a referência antes de fazer upload da imagem'
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
        message: 'Erro ao fazer upload da imagem. Por favor, tente novamente.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data, isEditing);
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isUploading} className="bg-primary text-onPrimary">
            {isUploading ? 'Uploading...' : isEditing ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
