
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "@/types/product";

interface ProductBasicInfoProps {
  form: UseFormReturn<ProductFormData>;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ProductBasicInfo({ form, isUploading, onImageUpload }: ProductBasicInfoProps) {
  return (
    <div className="grid gap-4">
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
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#9b87f5] file:text-white hover:file:bg-[#9b87f5]/80"
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
