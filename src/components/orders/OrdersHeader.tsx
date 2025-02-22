
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
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
    <div className="bg-surfaceContainer shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary hover:text-primary/80 hover:bg-primary/10" 
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              {company?.logo_url ? (
                <img 
                  src={company.logo_url} 
                  alt={`${company.name} logo`}
                  className="h-8 w-8 object-contain rounded"
                />
              ) : (
                <Building2 className="h-8 w-8 text-primary" />
              )}
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {company?.name}
                </h1>
                <span className="text-gray-400 dark:text-gray-500">/</span>
                <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                  Pedidos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
