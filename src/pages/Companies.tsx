
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Company, SortField, SortOrder } from "@/types/company";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/companies/CompanyForm";
import { CompanyList } from "@/components/companies/CompanyList";

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, [sortField, sortOrder]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order(sortField, { ascending: sortOrder === 'asc' });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar empresas",
        variant: "destructive",
      });
      return;
    }

    setCompanies(data);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleCompanyStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('companies')
      .update({ active: !currentStatus })
      .eq('id', id);

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Administração de Empresas</h1>
        </div>

        <CompanyForm onSubmitSuccess={fetchCompanies} />

        <CompanyList
          companies={companies}
          sortField={sortField}
          sortOrder={sortOrder}
          onToggleSort={toggleSort}
          onToggleStatus={toggleCompanyStatus}
          onUpdateSuccess={fetchCompanies}
        />
      </div>
    </div>
  );
}
