
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchProducts } from "@/services/productService";
import { supabase } from "@/integrations/supabase/client";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { NotFoundError } from "@/components/error/NotFoundError";
import { OrderContainer } from "@/components/order/OrderContainer";

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
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (error || !company) {
    return <NotFoundError />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <CompanyHeader company={company} />
      <OrderContainer companyId={companyId || ''} products={products} />
    </div>
  );
};

export default Index;
