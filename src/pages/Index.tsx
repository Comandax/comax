
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchProducts } from "@/services/productService";
import { LoadingState } from "@/components/index/LoadingState";
import { NotFoundState } from "@/components/index/NotFoundState";
import { CompanyInfo } from "@/components/index/CompanyInfo";
import { OrderForm } from "@/components/index/OrderForm";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { companyId } = useParams<{ companyId?: string }>();

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        setIsLoading(false);
        setError("Por favor, verifique se o endereço está correto.");
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) {
        console.error('Error fetching company:', error);
        setError("Por favor, verifique se o endereço está correto.");
        toast({
          title: "Erro ao carregar informações da empresa",
          variant: "destructive",
        });
      } else {
        setCompany(data);
      }
      setIsLoading(false);
    };

    fetchCompany();
  }, [companyId, toast]);

  const { data: products = [] } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => fetchProducts(companyId || ''),
    enabled: !!companyId && !!company
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !company) {
    return <NotFoundState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <CompanyInfo company={company} />
        <OrderForm companyId={companyId} products={products} />
      </div>
    </div>
  );
};

export default Index;
