
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
import { formatPhoneNumber } from "../utils/phoneFormatter";

interface UserContactFieldsProps {
  form: UseFormReturn<ProfileFormData>;
}

export function UserContactFields({ form }: UserContactFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Celular</FormLabel>
            <FormControl>
              <Input
                type="tel"
                inputMode="numeric"
                {...field}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
