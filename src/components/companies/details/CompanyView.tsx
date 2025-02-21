
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface CompanyViewProps {
  company: Company;
  onEditClick: () => void;
}

export function CompanyView({ company, onEditClick }: CompanyViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Dados da Empresa</h2>
        </div>
        <Button onClick={onEditClick} variant="outline" className="gap-2">
          Editar
        </Button>
      </div>

      <div className="grid gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome da Empresa</h3>
          <p className="text-foreground">{company.name}</p>
        </div>

        {company.logo_url && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Logo</h3>
            <img 
              src={company.logo_url} 
              alt="Logo da empresa" 
              className="w-32 h-32 object-contain border rounded-lg bg-background"
            />
          </div>
        )}
      </div>
    </div>
  );
}
