
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { LogOut, Edit, UserCog, CreditCard, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateRepresentative } from "@/services/representativeService";
import { UserEditModal } from "@/components/users/UserEditModal";
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
  const [representativeData, setRepresentativeData] = useState<{ id: string, identifier: string, pix_key: string | null } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newPixKey, setNewPixKey] = useState("");

  useEffect(() => {
    const fetchRepresentativeIdentifier = async () => {
      if (user?.roles?.includes('representative')) {
        const { data: representative } = await supabase
          .from('representatives')
          .select('id, identifier, pix_key')
          .eq('profile_id', user.id)
          .single();

        if (representative) {
          setRepresentativeData(representative);
          setNewIdentifier(representative.identifier);
          setNewPixKey(representative.pix_key || "");
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
      // Verifica se o erro é devido a um identificador duplicado
      if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar identificador",
          description: "Este identificador já está em uso. Por favor, escolha outro.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar identificador",
          description: error.message,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePixKey = async () => {
    if (!representativeData) return;
    
    setIsUpdating(true);
    try {
      const result = await updateRepresentative(representativeData.id, {
        pix_key: newPixKey,
      });
      
      setRepresentativeData({ ...representativeData, pix_key: result.pix_key });
      
      toast({
        title: "Chave PIX atualizada!",
        description: "Sua chave PIX foi atualizada com sucesso.",
      });
      setShowPixModal(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar chave PIX",
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
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/67b9ca3d-df4a-465c-a730-e739b97b5c88.png" 
              alt="Comax Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-[#403E43]">Painel de Usuários</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(true)}
              className="text-primary hover:bg-primary/10 border-primary"
            >
              <UserCog className="h-5 w-5 mr-2" />
              Editar Perfil
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-destructive hover:bg-destructive/10 border-destructive"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {user?.roles?.includes('representative') && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-xl font-semibold text-primary">Seu Link de Indicação</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Compartilhe este link para convidar novos usuários. Você poderá acompanhar todos os usuários que se cadastrarem através dele.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-white/80 border-primary/30 focus:border-primary"
                    />
                    <Button 
                      onClick={copyToClipboard}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      Copiar Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEditModal(true)}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar ID
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg border-2 border-primary/20 hover:border-primary/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-1 bg-primary rounded-full" />
                    <h2 className="text-xl font-semibold text-primary">Chave PIX</h2>
                  </div>
                  {representativeData?.pix_key ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Sua chave PIX cadastrada para recebimento de comissões:
                      </p>
                      <div className="flex gap-2 items-center p-3 bg-white/80 rounded-lg border border-primary/30">
                        <CreditCard className="text-primary h-5 w-5" />
                        <span className="flex-1 font-medium text-foreground">{representativeData.pix_key}</span>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setNewPixKey(representativeData.pix_key || "");
                            setShowPixModal(true);
                          }}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-destructive p-3 bg-destructive/5 rounded-lg">
                        <XCircle className="h-5 w-5" />
                        <p>Nenhuma chave PIX cadastrada</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cadastre uma chave PIX para receber suas comissões de forma automática.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowPixModal(true)}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cadastrar Chave PIX
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={showPixModal} onOpenChange={setShowPixModal}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {representativeData?.pix_key ? "Editar Chave PIX" : "Cadastrar Chave PIX"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newPixKey}
                onChange={(e) => setNewPixKey(e.target.value)}
                placeholder="Digite sua chave PIX"
                className="w-full border-primary/20"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Esta chave PIX será usada para receber suas comissões.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPixModal(false)}
                disabled={isUpdating}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={updatePixKey}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isUpdating ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <UserEditModal 
          isOpen={showEditModal}
          onOpenChange={setShowEditModal}
        />

        <UserList />
      </div>
    </div>
  );
}
