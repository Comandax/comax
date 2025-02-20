
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "@/types/profile";

interface UserPasswordFieldsProps {
  form: UseFormReturn<ProfileFormData>;
  isEditMode?: boolean;
}

export function UserPasswordFields({ form, isEditMode }: UserPasswordFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>{isEditMode ? "Nova senha (opcional)" : "Senha"}</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>{isEditMode ? "Confirmar nova senha" : "Confirmar senha"}</FormLabel>
            <FormControl>
              <Input type="password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
