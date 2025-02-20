
import { UserList } from "@/components/users/UserList";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { updateRepresentative } from "@/services/representativeService";
import { UserEditModal } from "@/components/users/UserEditModal";
import { UserHeader } from "@/components/users/header/UserHeader";
import { RepresentativePanel } from "@/components/users/representative/RepresentativePanel";

export default function Users() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState<string>("");
  const [representativeData, setRepresentativeData] = useState<{ id: string, identifier: string, pix_key: string | null } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [showIdentifierModal, setShowIdentifierModal] = useState(false);
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
      setShowIdentifierModal(false);
    } catch (error: any) {
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
        <UserHeader onEditProfile={() => setShowEditModal(true)} />

        {user?.roles?.includes('representative') && (
          <RepresentativePanel
            referralLink={referralLink}
            onCopyLink={copyToClipboard}
            representativeData={representativeData}
            showIdentifierModal={showIdentifierModal}
            setShowIdentifierModal={setShowIdentifierModal}
            showPixModal={showPixModal}
            setShowPixModal={setShowPixModal}
            newIdentifier={newIdentifier}
            setNewIdentifier={setNewIdentifier}
            newPixKey={newPixKey}
            setNewPixKey={setNewPixKey}
            onUpdateIdentifier={updateIdentifier}
            onUpdatePixKey={updatePixKey}
            isUpdating={isUpdating}
          />
        )}

        <UserEditModal 
          isOpen={showEditModal}
          onOpenChange={setShowEditModal}
        />

        <UserList />
      </div>
    </div>
  );
}
