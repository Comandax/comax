import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import type { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyList } from "@/components/companies/CompanyList";
import { CompanyDetails } from "@/components/companies/CompanyDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, ExternalLink } from "lucide-react";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSuperuser = user?.roles?.includes('superuser');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCompanies();
  }, [user, navigate]);

  const fetchCompanies = async () => {
    if (!user) return;

    let query = supabase
      .from('companies')
      .select('*');

    // Se não for superusuário, filtra apenas as empresas do usuário
    if (!isSuperuser) {
      query = query.eq('owner_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive",
      });
      return;
    }

    setCompanies(data || []);
  };

  const toggleCompanyStatus = async (id: string, currentStatus: boolean) => {
    if (!user) return;

    const { error } = await supabase
      .from('companies')
      .update({ active: !currentStatus })
      .eq('id', id)
      .eq('owner_id', user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da empresa",
        variant: "destructive",
      });
      return;
    }

    fetchCompanies();
  };

  const copyToClipboard = async (shortName: string) => {
    const url = `${window.location.origin}/${shortName}`;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para sua área de transferência.",
    });
  };

  const openInNewTab = (shortName: string) => {
    const url = `${window.location.origin}/${shortName}`;
    window.open(url, '_blank');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="bg-gray-900/50 shadow-md">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
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
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar para o painel
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-8">
              {isSuperuser ? "Administração de Empresas" : "Minha Empresa"}
            </h1>
          </div>

          {(isSuperuser || companies.length === 0) && (
            <CompanyForm onSubmitSuccess={fetchCompanies} />
          )}

          {!isSuperuser && companies.length === 1 ? (
            <>
              <Card className="p-6 bg-white/95">
                <CompanyDetails 
                  company={companies[0]}
                  onUpdateSuccess={fetchCompanies}
                />
              </Card>
              <Card className="p-6 bg-white/95">
                <h2 className="text-xl font-semibold mb-4">Link para Pedidos</h2>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      readOnly
                      value={`${window.location.origin}/${companies[0].short_name}`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <Button
                        onClick={() => copyToClipboard(companies[0].short_name)}
                        variant="outline"
                        size="icon"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Copiar</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Button
                        onClick={() => openInNewTab(companies[0].short_name)}
                        variant="outline"
                        size="icon"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <span className="text-xs mt-1">Abrir</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Compartilhe este link com seus clientes para que eles possam fazer pedidos.
                </p>
              </Card>
            </>
          ) : (
            <CompanyList
              companies={companies}
              sortField="name"
              sortOrder="asc"
              onToggleSort={() => {}}
              onToggleStatus={toggleCompanyStatus}
              onUpdateSuccess={fetchCompanies}
              isSuperuser={isSuperuser}
            />
          )}
        </div>
      </div>
    </div>
  );
}
