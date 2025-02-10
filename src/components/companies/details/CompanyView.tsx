
import { Button } from "@/components/ui/button";
import { Company } from "@/types/company";

interface CompanyViewProps {
  company: Company;
  onEditClick: () => void;
}

export function CompanyView({ company, onEditClick }: CompanyViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{company.name}</h2>
      <div className="flex gap-4">
        {company.logo_url && (
          <img
            src={company.logo_url}
            alt={`Logo ${company.name}`}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <p><strong>Responsável:</strong> {company.responsible}</p>
          <p><strong>Email:</strong> {company.email}</p>
          <p><strong>Telefone:</strong> {company.phone}</p>
          <p><strong>Status:</strong> {company.active ? "Ativo" : "Inativo"}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onEditClick}>
          Editar
        </Button>
      </div>
    </div>
  );
}
