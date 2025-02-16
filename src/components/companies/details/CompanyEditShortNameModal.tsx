
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyEditFormData } from "@/types/company";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  short_name: z
    .string()
    .min(1, "O nome curto é obrigatório")
    .max(50, "O nome curto deve ter no máximo 50 caracteres")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
});

interface CompanyEditShortNameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  currentShortName: string;
  onSuccess: () => void;
}

export function CompanyEditShortNameModal({
  open,
  onOpenChange,
  companyId,
  currentShortName,
  onSuccess,
}: CompanyEditShortNameModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CompanyEditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      short_name: currentShortName,
    },
  });

  const onSubmit = async (data: CompanyEditFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({ short_name: data.short_name })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Nome curto atualizado com sucesso",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar nome curto da empresa",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <div className="h-6 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
            Editar Nome Curto
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="short_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Curto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="nome-curto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
