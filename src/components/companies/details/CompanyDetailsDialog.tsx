
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Company } from "@/types/company";
import { CompanyView } from "./CompanyView";
import { CompanyEditForm } from "./CompanyEditForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompanyDetailsDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CompanyDetailsDialog({ 
  company, 
  open, 
  onOpenChange,
  onSuccess 
}: CompanyDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (editData: Partial<Company>, logoFile: File | null) => {
    try {
      let logo_url = company.logo_url;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `public/company-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        logo_url = publicUrl;
      }

      const { error } = await supabase
        .from('companies')
        .update({
          ...editData,
          logo_url: logo_url
        })
        .eq('id', company.id);

      if (error) throw error;

      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram atualizados com sucesso."
      });

      setIsEditing(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar empresa",
        description: "Ocorreu um erro ao atualizar os dados da empresa."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {isEditing ? (
          <CompanyEditForm
            company={company}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        ) : (
          <CompanyView
            company={company}
            onEditClick={handleEditClick}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
