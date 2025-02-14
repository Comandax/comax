
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createRepresentative } from "@/services/representativeService";

export default function RepresentativeSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createUserProfile, isPending: isCreating } = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Primeiro cria o perfil do usuário
      const profile = await createProfile(data);
      // Depois cria o representante
      await createRepresentative(profile.id);
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
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
      createUserProfile(data, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto px-4">
            <div className="py-1.5">
              <img 
                src="/lovable-uploads/02adcbae-c4a2-4a37-8214-0e48d6485253.png" 
                alt="COMAX Logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white/95 p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Cadastro de Representante</h1>
          
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
        </Card>
      </div>
    </div>
  );
}
