
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import type { ProductFormData } from "@/types/product";

interface SizesFormProps {
  form: UseFormReturn<ProductFormData>;
}

export function SizesForm({ form }: SizesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sizes",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Tamanhos e Valores</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ size: "", value: 0 })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tamanho
        </Button>
      </div>

      {fields.map((field, index) => (
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
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
