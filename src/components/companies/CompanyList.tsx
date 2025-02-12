
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Company, SortField } from "@/types/company";
import { CompanyDetails } from "./CompanyDetails";

interface CompanyListProps {
  companies: Company[];
  sortField: SortField;
  sortOrder: "asc" | "desc";
  onToggleSort: (field: SortField) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onUpdateSuccess: () => void;
  isSuperuser: boolean;
}

export function CompanyList({
  companies,
  sortField,
  sortOrder,
  onToggleSort,
  onToggleStatus,
  onUpdateSuccess,
  isSuperuser,
}: CompanyListProps) {
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
  };

  if (companies.length === 0 && isSuperuser) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">
          Nenhuma empresa cadastrada ainda.
        </p>
      </Card>
    );
  }

  if (companies.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 cursor-pointer" onClick={() => onToggleSort('name')}>
                Nome <SortIcon field="name" />
              </th>
              <th className="text-left p-2 cursor-pointer" onClick={() => onToggleSort('created_at')}>
                Data de Criação <SortIcon field="created_at" />
              </th>
              <th className="text-right p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <>
                <tr
                  key={company.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedCompanyId(expandedCompanyId === company.id ? null : company.id)}
                >
                  <td className="p-2">{company.name}</td>
                  <td className="p-2">{format(new Date(company.created_at), 'dd/MM/yyyy HH:mm')}</td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Label htmlFor={`status-${company.id}`}>
                        {company.active ? "Ativo" : "Inativo"}
                      </Label>
                      <Switch
                        id={`status-${company.id}`}
                        checked={company.active}
                        onCheckedChange={() => onToggleStatus(company.id, company.active)}
                      />
                    </div>
                  </td>
                </tr>
                {expandedCompanyId === company.id && (
                  <tr>
                    <td colSpan={4} className="p-4 bg-gray-50">
                      <CompanyDetails 
                        company={company}
                        onUpdateSuccess={onUpdateSuccess}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
