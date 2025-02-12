
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/types/product";

interface ProductQuantitiesProps {
  form: UseFormReturn<ProductFormData>;
  quantityArray: UseFieldArrayReturn<ProductFormData, "quantities", "id">;
}

export function ProductQuantities({ form, quantityArray }: ProductQuantitiesProps) {
  const { fields, append, remove } = quantityArray;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Quantidades</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: 0 })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Quantidade
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <FormField
              control={form.control}
              name={`quantities.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      {...field}
                      type="number"
                      min="0"
                      placeholder="Quantidade"
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
    </div>
  );
}
