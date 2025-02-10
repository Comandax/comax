
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyView } from "./details/CompanyView";
import { CompanyEditForm } from "./details/CompanyEditForm";
import { uploadCompanyLogo } from "@/services/companyLogoService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CompanyDetailsProps {
  company: Company;
  onUpdateSuccess: () => void;
}

export function CompanyDetails({ company, onUpdateSuccess }: CompanyDetailsProps) {
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

    if (!editData.name || !editData.responsible || !editData.email || !editData.phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
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
        responsible: editData.responsible,
        email: editData.email,
        phone: editData.phone,
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

  const CompanyViewWithOrdersLink = (props: { company: Company; onEditClick: () => void }) => {
    return (
      <div className="space-y-6">
        <CompanyView {...props} />
        <div className="flex justify-end">
          <Link to={`/orders?company=${company.id}`}>
            <Button variant="outline">Ver Pedidos</Button>
          </Link>
        </div>
      </div>
    );
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
    <CompanyViewWithOrdersLink
      company={company}
      onEditClick={() => setEditMode(true)}
    />
  );
}
