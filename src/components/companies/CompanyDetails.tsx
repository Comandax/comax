
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";

interface CompanyDetailsProps {
  company: Company;
  onUpdateSuccess: () => void;
}

export function CompanyDetails({ company, onUpdateSuccess }: CompanyDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Company>>(company);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const handleUpdate = async () => {
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
      logoUrl = await uploadLogo(logoFile);
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
      .eq('id', company.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa",
        variant: "destructive",
      });
      return;
    }

    setEditMode(false);
    setLogoFile(null);
    toast({
      title: "Sucesso",
      description: "Empresa atualizada com sucesso!",
    });
    onUpdateSuccess();
  };

  if (editMode) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome da Empresa</Label>
            <Input
              id="edit-name"
              value={editData.name || ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-responsible">Responsável</Label>
            <Input
              id="edit-responsible"
              value={editData.responsible || ""}
              onChange={(e) => setEditData({ ...editData, responsible: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editData.email || ""}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Telefone</Label>
            <Input
              id="edit-phone"
              value={editData.phone || ""}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-logo">Logo da Empresa</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
              />
              {(logoFile || editData.logo_url) && (
                <span className="text-sm text-gray-500">
                  {logoFile ? logoFile.name : "Logo atual"}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            setEditMode(false);
            setEditData(company);
            setLogoFile(null);
          }}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate}>
            Salvar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt={`Logo ${company.name}`}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <p><strong>Email:</strong> {company.email}</p>
          <p><strong>Telefone:</strong> {company.phone}</p>
          <p><strong>Status:</strong> {company.active ? "Ativo" : "Inativo"}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => setEditMode(true)}>
          Editar
        </Button>
      </div>
    </div>
  );
}
