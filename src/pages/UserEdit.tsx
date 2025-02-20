
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id!),
    enabled: !!id,
  });

  const { mutate: updateUserProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: ProfileFormData) => updateProfile(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      
      // Redireciona para /users se for representante, senão para /admin
      if (user?.roles?.includes('representative')) {
        navigate('/users');
      } else {
        navigate('/admin');
      }
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    return new Promise<void>((resolve, reject) => {
      updateUserProfile(data, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  if (isLoadingProfile) return <div>Carregando...</div>;
  if (!profile) return <div>Usuário não encontrado</div>;

  const initialData: ProfileFormData = {
    ...profile,
    password: '',
    confirmPassword: '',
  };

  // Determina para qual rota o botão voltar deve navegar
  const handleBackClick = () => {
    if (user?.roles?.includes('representative')) {
      navigate('/users');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surfaceContainer shadow-md">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center gap-2 py-1.5">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleBackClick}
                className="text-onSurface hover:text-onSurface/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <img 
                src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                alt="COMAX Logo" 
                className="h-8 w-auto cursor-pointer"
                onClick={handleBackClick}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-lg bg-surface p-6">
          <h1 className="text-2xl font-bold text-onSurface mb-6">Editar Usuário</h1>

          <UserForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
          />
        </Card>
      </div>
    </div>
  );
}
