
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/types/product";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormData>;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ProductBasicInfo({ form, isUploading, onImageUpload }: ProductBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          name="isNew"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Lançamento</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
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

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagem do Produto</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={onImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
