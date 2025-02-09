
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { productFormSchema } from "@/schemas/productSchema";
import type { Product, ProductFormData } from "@/types/product";

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
      sizes: initialData?.sizes || [{ size: "", value: 0 }],
      quantities: initialData?.quantities || [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
    },
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referência</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Tamanhos e Valores</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSize({ size: "", value: 0 })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Tamanho
            </Button>
          </div>

          {sizeFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <FormField
                control={form.control}
                name={`sizes.${index}.size`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Tamanho (P, M, G, etc)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`sizes.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01"
                        placeholder="Valor"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-0.5"
                onClick={() => removeSize(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
