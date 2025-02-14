
import { Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Company } from "@/types/company";

interface CompanyInfoProps {
  company: Pick<Company, 'name' | 'logo_url'>;
}

export const CompanyInfo = ({ company }: CompanyInfoProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/95 shadow-md mb-8">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              {company.logo_url && (
                <img 
                  src={company.logo_url} 
                  alt={`${company.name} logo`}
                  className="w-15 h-15 object-contain rounded-lg"
                />
              )}
              <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Painel Administrativo"
            >
              <Settings2 size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
