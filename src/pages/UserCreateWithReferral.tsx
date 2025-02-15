
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
import { UserPlus } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <ReferralHeader />

      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h1 className="text-2xl font-bold text-[#403E43]">Criar Conta</h1>
        </div>

        <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <UserPlus className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Nova Conta de Usuário</h2>
            </div>
            
            <ReferralInfo representativeName={representativeName} />

            <UserForm
              onSubmit={handleSubmit}
              isLoading={isCreating}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
