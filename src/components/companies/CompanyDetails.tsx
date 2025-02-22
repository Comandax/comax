
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyView } from "./details/CompanyView";
import { CompanyEditForm } from "./details/CompanyEditForm";
import { uploadCompanyLogo } from "@/services/companyLogoService";

interface CompanyDetailsProps {
  company: Company;
  onUpdateSuccess: () => void;
  onClose?: () => void;
}

export function CompanyDetails({ company, onUpdateSuccess, onClose }: CompanyDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleUpdate = async (editData: Partial<Company>, logoFile: File | null) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para atualizar uma empresa.",
        variant: "destructive",
      });
      return;
    }

    if (!editData.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da empresa.",
        variant: "destructive",
      });
      return;
    }

    let logoUrl = editData.logo_url;
    if (logoFile) {
      logoUrl = await uploadCompanyLogo(logoFile);
      if (!logoUrl) {
        toast({
          title: "Erro",
          description: "Falha ao fazer upload da logo.",
          variant: "destructive",
        });
        return;
      }
    }

    const { error } = await supabase
      .from('companies')
      .update({
        name: editData.name,
        logo_url: logoUrl,
        active: editData.active,
      })
      .eq('id', company.id)
      .eq('owner_id', user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa",
        variant: "destructive",
      });
      return;
    }

    setEditMode(false);
    toast({
      title: "Sucesso",
      description: "Empresa atualizada com sucesso!",
    });
    onUpdateSuccess();
  };

  if (editMode) {
    return (
      <CompanyEditForm
        company={company}
        onCancel={() => setEditMode(false)}
        onSave={handleUpdate}
      />
    );
  }

  return (
    <CompanyView
      company={company}
      onEditClick={() => {
        if (onClose) onClose();
        setEditMode(true);
      }}
    />
  );
}
