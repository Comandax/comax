
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function UserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      navigate('/users');
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

  // Convert Profile to ProfileFormData by adding empty password fields
  const initialData: ProfileFormData = {
    ...profile,
    password: '',
    confirmPassword: '',
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="py-1.5">
            <img 
              src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
              alt="COMAX Logo" 
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white/95 p-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')} 
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Painel
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Editar Usuário</h1>
          </div>

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
