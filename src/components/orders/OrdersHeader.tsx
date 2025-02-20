
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Company } from "@/types/company";

interface OrdersHeaderProps {
  userProfile: any;
  company: Company | null;
  onLogout: () => Promise<void>;
}

export const OrdersHeader = ({ userProfile, company, onLogout }: OrdersHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="text-gray-700 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    {company?.logo_url && (
                      <img 
                        src={company.logo_url} 
                        alt={`${company.name} logo`} 
                        className="h-8 w-auto"
                      />
                    )}
                    <span className="text-gray-900 font-medium">{company?.name}</span>
                  </div>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Pedidos</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
