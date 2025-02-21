
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
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">Dados da Empresa</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {company.logo_url ? (
          <div className="w-full sm:w-1/2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Logo</h3>
            <img 
              src={company.logo_url} 
              alt="Logo da empresa" 
              className="w-full aspect-square object-contain border rounded-lg bg-background p-4"
            />
          </div>
        ) : (
          <div className="w-full sm:w-1/2 aspect-square flex items-center justify-center border rounded-lg bg-background">
            <p className="text-muted-foreground text-center p-4">
              Nenhuma logo cadastrada
            </p>
          </div>
        )}

        <div className="w-full sm:w-1/2 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Nome da Empresa</h3>
            <p className="text-2xl font-semibold text-foreground">{company.name}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={onEditClick} variant="outline" className="gap-2">
          Editar
        </Button>
      </div>
    </div>
  );
}
