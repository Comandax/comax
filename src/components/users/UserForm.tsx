
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal('')),
  confirmPassword: z.string()
}).refine((data) => {
  // Se a senha estiver vazia, não precisa validar a confirmação
  if (!data.password || data.password.trim() === '') {
    return true;
  }
  // Se a senha foi fornecida, precisa coincidir com a confirmação
  return data.password === data.confirmPassword;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

interface UserFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const { toast } = useToast();

  // Função para formatar o número de telefone inicial
  const formatInitialPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "";
    
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Aplica a formatação apropriada baseada no comprimento
    if (cleaned.length === 10) {
      // Formato para telefone fixo: (XX) XXXX-XXXX
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11) {
      // Formato para celular: (XX) X XXXX-XXXX
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return cleaned;
  };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      phone: formatInitialPhoneNumber(initialData.phone),
    } : {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      // Remove a formatação do telefone antes de enviar
      const cleanedData = {
        ...data,
        phone: data.phone.replace(/\D/g, '')
      };
      await onSubmit(cleanedData);
      toast({
        title: "Sucesso",
        description: initialData 
          ? "Usuário atualizado com sucesso."
          : "Um email de confirmação foi enviado para o seu endereço de email.",
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error?.message || "Erro ao processar usuário",
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');
    
    // Limita a 11 caracteres
    const limited = cleaned.slice(0, 11);
    
    // Aplica a máscara conforme o usuário digita
    let formatted = limited;
    if (limited.length > 0) {
      if (limited.length <= 2) {
        formatted = `(${limited}`;
      } else if (limited.length <= 3) {
        formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
      } else if (limited.length <= 7) {
        formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 3)} ${limited.slice(3)}`;
      } else if (limited.length <= 11) {
        if (limited.length === 10) {
          // Formato para telefone fixo: (XX) XXXX-XXXX
          formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
        } else {
          // Formato para celular: (XX) X XXXX-XXXX
          formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 3)} ${limited.slice(3, 7)}-${limited.slice(7)}`;
        }
      }
    }
    return formatted;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel>{initialData ? "Nova senha (opcional)" : "Senha"}</FormLabel>
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
              <FormLabel>{initialData ? "Confirmar nova senha" : "Confirmar senha"}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
