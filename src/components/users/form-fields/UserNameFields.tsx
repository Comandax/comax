
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

interface UserNameFieldsProps {
  form: UseFormReturn<ProfileFormData>;
}

export function UserNameFields({ form }: UserNameFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem className="text-left">
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
        name="last_name"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Sobrenome</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
