
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { userFormSchema } from "./schemas/userFormSchema";
import { formatInitialPhoneNumber } from "./utils/phoneFormatter";
import { UserNameFields } from "./form-fields/UserNameFields";
import { UserContactFields } from "./form-fields/UserContactFields";
import { UserPasswordFields } from "./form-fields/UserPasswordFields";

interface UserFormProps {
  initialData?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(userFormSchema),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <UserNameFields form={form} />
        <UserContactFields form={form} />
        <UserPasswordFields form={form} isEditMode={!!initialData} />
        <Button type="submit" disabled={isLoading} className="bg-primary text-onPrimary">
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
