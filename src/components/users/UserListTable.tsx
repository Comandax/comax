
import { Profile, SortField } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserListTableProps {
  profiles: Profile[];
  onSort: (field: SortField) => void;
}

export function UserListTable({ profiles, onSort }: UserListTableProps) {
  const { user } = useAuth();
  const isSuperuser = user?.roles?.includes('superuser');

  return (
    <div className="bg-white/80 rounded-lg border border-primary/30">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/15 hover:bg-primary/20">
            <TableHead 
              onClick={() => onSort('name')} 
              className="cursor-pointer font-semibold text-primary"
            >
              Nome <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
            </TableHead>
            <TableHead 
              onClick={() => onSort('company')} 
              className="cursor-pointer font-semibold text-primary"
            >
              Empresa <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
            </TableHead>
            {isSuperuser && (
              <>
                <TableHead 
                  onClick={() => onSort('email')} 
                  className="cursor-pointer font-semibold text-primary"
                >
                  Email <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
                <TableHead 
                  onClick={() => onSort('phone')} 
                  className="cursor-pointer font-semibold text-primary"
                >
                  Celular <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
              </>
            )}
            <TableHead 
              onClick={() => onSort('created_at')} 
              className="cursor-pointer font-semibold text-primary"
            >
              Criado em <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile, index) => (
            <TableRow 
              key={profile.id} 
              className={`
                transition-colors
                ${index % 2 === 0 ? 'bg-white' : 'bg-primary/5'}
                hover:bg-primary/10
              `}
            >
              <TableCell className="font-medium">{profile.fullName}</TableCell>
              <TableCell>{profile.companyName}</TableCell>
              {isSuperuser && (
                <>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                </>
              )}
              <TableCell>
                {format(new Date(profile.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
