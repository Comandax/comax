
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyFormProps {
  onSubmitSuccess: () => void;
}

export function CompanyForm({ onSubmitSuccess }: CompanyFormProps) {
  const [newCompany, setNewCompany] = useState<Partial<Company>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma empresa.",
        variant: "destructive",
      });
      return;
    }

    if (!newCompany.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da empresa.",
        variant: "destructive",
      });
      return;
    }

    let logoUrl = null;
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
      .insert([{
        name: newCompany.name,
        logo_url: logoUrl,
        owner_id: user.id
      }]);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar empresa",
        variant: "destructive",
      });
      return;
    }

    setNewCompany({});
    setLogoFile(null);
    toast({
      title: "Sucesso",
      description: "Empresa cadastrada com sucesso!",
    });
    onSubmitSuccess();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input
              id="name"
              value={newCompany.name || ""}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              placeholder="Nome da empresa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo da Empresa</Label>
            <div className="flex items-center gap-2">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
              />
              {logoFile && (
                <span className="text-sm text-gray-500">
                  {logoFile.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="pt-4">
          <Button type="submit" className="w-full text-onPrimary">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Empresa
          </Button>
        </div>
      </form>
    </Card>
  );
}
