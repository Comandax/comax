
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createProfile } from "@/services/profileService";
import { UserForm } from "@/components/users/UserForm";
import { ProfileFormData } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function UserCreateWithReferral() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [representativeId, setRepresentativeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepresentative = async () => {
      if (!identifier) {
        setError("Link de indicação inválido. Por favor, verifique o link e tente novamente.");
        setLoading(false);
        return;
      }

      console.log("Buscando representante com identificador:", identifier);

      try {
        // Primeiro busca apenas o representante pelo identificador
        const { data: representative, error: repError } = await supabase
          .from('representatives')
          .select('*')
          .eq('identifier', identifier.toLowerCase())
          .maybeSingle();

        console.log("Resultado da busca do representante:", { representative, repError });

        if (repError) {
          console.error("Erro ao buscar representante:", repError);
          throw new Error("Erro ao verificar o link de indicação.");
        }

        if (!representative) {
          throw new Error("Representante não encontrado. Verifique o link de indicação.");
        }

        // Agora busca o perfil do representante
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', representative.profile_id)
          .single();

        console.log("Resultado da busca do perfil:", { profile, profileError });

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          throw new Error("Erro ao verificar o link de indicação.");
        }

        // Verifica se o usuário tem a role de representante
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', representative.profile_id)
          .eq('role', 'representative');

        console.log("Resultado da busca de roles:", { userRoles, rolesError });

        if (rolesError) {
          console.error("Erro ao verificar roles:", rolesError);
          throw new Error("Erro ao verificar o link de indicação.");
        }

        if (!userRoles || userRoles.length === 0) {
          throw new Error("Link de indicação inválido ou expirado.");
        }

        setRepresentativeId(representative.id);
        
        toast({
          title: "Representante identificado",
          description: `Você está se cadastrando através da indicação de ${profile.first_name} ${profile.last_name}.`,
        });
      } catch (err: any) {
        console.error("Erro detalhado:", err);
        setError(err.message || "Erro ao verificar o link de indicação. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepresentative();
  }, [identifier, toast]);

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
      // Adiciona o ID do representante aos dados do perfil
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
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Criar Conta</h1>
          
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
