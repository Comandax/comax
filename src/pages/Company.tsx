
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Company } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyList } from "@/components/companies/CompanyList";
import { CompanyDetails } from "@/components/companies/CompanyDetails";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

export default function Company() {
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">
            {isSuperuser ? "Administração de Empresas" : "Minha Empresa"}
          </h1>
        </div>

        {(isSuperuser || companies.length === 0) && (
          <CompanyForm onSubmitSuccess={fetchCompanies} />
        )}

        {!isSuperuser && companies.length === 1 ? (
          <Card className="p-6">
            <CompanyDetails 
              company={companies[0]}
              onUpdateSuccess={fetchCompanies}
            />
          </Card>
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
  );
}
