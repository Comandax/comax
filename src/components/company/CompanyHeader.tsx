
import { Card } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Company } from "@/types/company";

type CompanyHeaderProps = {
  company: Pick<Company, 'name' | 'logo_url'>;
};

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-white/90">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {company.logo_url && (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`}
              className="w-16 h-16 object-contain rounded-lg"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin")}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          title="Painel Administrativo"
        >
          <Settings2 size={24} />
        </button>
      </div>
    </Card>
  );
};
