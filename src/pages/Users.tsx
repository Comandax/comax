
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Users() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState<string>("");
  const [representativeData, setRepresentativeData] = useState<{ id: string, identifier: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState("");

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
          setNewIdentifier(representative.identifier);
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
        identifier: newIdentifier,
      });
      
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/r/${result.identifier}`);
      setRepresentativeData({ ...representativeData, identifier: result.identifier });
      
      toast({
        title: "Identificador atualizado!",
        description: "Seu link de indicação foi atualizado com sucesso.",
      });
      setShowEditModal(false);
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
                    onClick={() => setShowEditModal(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar ID
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Identificador</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newIdentifier}
                onChange={(e) => setNewIdentifier(e.target.value)}
                placeholder="Novo identificador"
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                Este identificador será usado no seu link de indicação.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                onClick={updateIdentifier}
                disabled={isUpdating}
              >
                {isUpdating ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <UserList />
      </div>
    </div>
  );
}
