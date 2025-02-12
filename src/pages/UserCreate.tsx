
import { useEffect } from "react";
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
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleLogoutIfLoggedIn = async () => {
      if (user) {
        try {
          await logout();
          toast({
            title: "Logout realizado",
            description: "Por favor, crie uma nova conta.",
          });
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }
      }
    };

    handleLogoutIfLoggedIn();
  }, [user, logout, toast]);

  const { mutate: createUserProfile, isPending: isCreating } = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Conta criada com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });
      navigate('/login');
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
