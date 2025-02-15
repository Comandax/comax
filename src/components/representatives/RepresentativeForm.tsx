
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RepresentativeFormData } from "@/types/representative";

const formSchema = z.object({
  pix_key: z.string().min(1, "A chave PIX é obrigatória"),
});

interface RepresentativeFormProps {
  onSubmit: (data: RepresentativeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function RepresentativeForm({ onSubmit, isLoading }: RepresentativeFormProps) {
  const form = useForm<RepresentativeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pix_key: "",
    },
  });

  const handleSubmit = async (data: RepresentativeFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error: any) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pix_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave PIX</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Informe sua chave PIX" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Cadastrando..." : "Cadastrar como Representante"}
        </Button>
      </form>
    </Form>
  );
}
