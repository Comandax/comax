
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Company } from "@/types/company";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { shortName } = useParams<{ shortName?: string }>();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!shortName) return;
      
      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('short_name', shortName)
        .single();
      
      if (data) {
        setCompany(data);
      }
    };

    fetchCompany();
  }, [shortName]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 space-y-6 bg-surface">
        <div className="text-center space-y-4">
          {company?.logo_url && (
            <div className="flex justify-center">
              <img 
                src={company.logo_url} 
                alt={`${company.name} logo`} 
                className="h-16 w-auto object-contain"
              />
            </div>
          )}
          {company?.name && (
            <h2 className="text-xl font-semibold text-onSurface">{company.name}</h2>
          )}
          <div className="flex justify-center">
            <div className="bg-primaryContainer p-3 rounded-full">
              <Check className="w-12 h-12 text-onPrimaryContainer" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-onSurface">Pedido Realizado com Sucesso!</h1>
          <p className="text-onSurfaceVariant">
            Seu pedido foi registrado e em breve entraremos em contato.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate(`/${shortName}`)}
            className="bg-primary text-onPrimary hover:bg-primary/90"
          >
            Fazer Novo Pedido
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
