
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    onError: (error: Error) => {
      // Verifica se é um erro de rate limit
      if (error.message.includes('rate limit') || error.message.includes('after 38 seconds')) {
        toast({
          variant: "destructive",
          title: "Erro ao criar usuário",
          description: "Por favor, aguarde alguns segundos antes de tentar novamente.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao criar usuário",
          description: error.message,
        });
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Criar Conta</h1>
          
          <Alert className="mb-6" variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Após criar sua conta, você precisará confirmar seu email antes de fazer login.
              Se não receber o email de confirmação, aguarde alguns segundos e tente criar a conta novamente.
            </AlertDescription>
          </Alert>

          <UserForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        </div>
      </div>
    </div>
  );
}
