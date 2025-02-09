
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { productFormSchema } from "@/schemas/productSchema";
import type { Product, ProductFormData } from "@/types/product";
import { ImageUpload } from "./form/ImageUpload";
import { BasicInfo } from "./form/BasicInfo";
import { SizesForm } from "./form/SizesForm";
import { QuantitiesForm } from "./form/QuantitiesForm";

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Product;
}

export function ProductForm({ onSubmit, initialData }: ProductFormProps) {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <ImageUpload form={form} />
          <BasicInfo form={form} />
        </div>

        <SizesForm form={form} />
        <QuantitiesForm form={form} />

        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
