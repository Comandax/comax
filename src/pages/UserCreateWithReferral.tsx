
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { LoadingScreen } from "@/components/users/LoadingScreen";
import { ErrorScreen } from "@/components/users/ErrorScreen";
import { ReferralHeader } from "@/components/users/ReferralHeader";
import { ReferralInfo } from "@/components/users/ReferralInfo";
import { useRepresentative } from "@/hooks/useRepresentative";

export default function UserCreateWithReferral() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { representativeId, loading, error, representativeName } = useRepresentative(identifier);

  const { mutate: createUserProfile, isPending: isCreating } = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Um email de confirmação foi enviado. Por favor, verifique sua caixa de entrada.",
      });
      navigate('/login');
    },
    onError: (error: Error) => {
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
      const profileData = {
        ...data,
        representative_id: representativeId,
      };

      createUserProfile(profileData, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen">
      <ReferralHeader />

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Criar Conta</h1>
          
          <ReferralInfo representativeName={representativeName} />

          <UserForm
            onSubmit={handleSubmit}
            isLoading={isCreating}
          />
        </Card>
      </div>
    </div>
  );
}
