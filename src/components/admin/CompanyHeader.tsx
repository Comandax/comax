
import { Building2 } from "lucide-react";
import type { Company } from "@/types/company";

interface CompanyHeaderProps {
  company: Company | null;
}

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-6">
      <div className="flex flex-col items-center space-y-4">
        {company?.logo_url ? (
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <img
              src={company.logo_url}
              alt={`Logo ${company.name}`}
              className="relative w-32 h-32 object-contain"
            />
          </div>
        ) : (
          <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
            <Building2 className="w-16 h-16 text-primary/50" />
          </div>
        )}
        <div className="w-full text-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {company?.name || 'Empresa'}
          </h2>
        </div>
      </div>
    </div>
  );
};
