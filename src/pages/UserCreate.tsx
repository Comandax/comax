
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function UserCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const { mutate: createUserProfile, isPending: isCreating } = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Conta criada com sucesso!",
        description: user?.roles?.includes('superuser')
          ? "Redirecionando para a lista de usuários."
          : "Um email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.",
      });
      
      // Se for superusuário, redireciona para a lista de usuários
      // Caso contrário, redireciona para o login
      if (user?.roles?.includes('superuser')) {
        navigate('/users');
      } else {
        navigate('/login');
      }
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    return new Promise<void>((resolve, reject) => {
      createUserProfile(data, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Criar Conta</h1>
        <UserForm
          onSubmit={handleSubmit}
          isLoading={isCreating}
        />
      </div>
    </div>
  );
}
