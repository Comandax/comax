
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/types/product";

interface ImageUploadProps {
  form: UseFormReturn<ProductFormData>;
}

export function ImageUpload({ form }: ImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
      form.setValue("image", URL.createObjectURL(file));
    }
  };

  return (
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
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
