
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { LogOut, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateRepresentative } from "@/services/representativeService";

export default function Users() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState<string>("");
  const [representativeData, setRepresentativeData] = useState<{ id: string, identifier: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchRepresentativeIdentifier = async () => {
      if (user?.roles?.includes('representative')) {
        const { data: representative } = await supabase
          .from('representatives')
          .select('id, identifier')
          .eq('profile_id', user.id)
          .single();

        if (representative) {
          setRepresentativeData(representative);
          const baseUrl = window.location.origin;
          setReferralLink(`${baseUrl}/r/${representative.identifier}`);
        }
      }
    };

    fetchRepresentativeIdentifier();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você será redirecionado para a página de login.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Tente novamente em alguns instantes.",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copiado!",
      description: "O link de indicação foi copiado para sua área de transferência.",
    });
  };

  const updateIdentifier = async () => {
    if (!representativeData) return;
    
    setIsUpdating(true);
    try {
      const result = await updateRepresentative(representativeData.id, {
        identifier: representativeData.identifier,
      });
      
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/r/${result.identifier}`);
      
      toast({
        title: "Identificador atualizado!",
        description: "Seu link de indicação foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar identificador",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Painel de Usuários</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sair
          </Button>
        </div>

        {user?.roles?.includes('representative') && referralLink && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Seu Link de Indicação</h2>
                <p className="text-sm text-gray-500">
                  Compartilhe este link para convidar novos usuários. Você poderá acompanhar todos os usuários que se cadastrarem através dele.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-gray-50"
                  />
                  <Button onClick={copyToClipboard}>
                    Copiar Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={updateIdentifier}
                    disabled={isUpdating}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isUpdating ? "Atualizando..." : "Atualizar ID"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <UserList />
      </div>
    </div>
  );
}
