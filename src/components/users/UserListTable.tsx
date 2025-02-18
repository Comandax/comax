
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
import { useIsMobile } from "@/hooks/use-mobile";

interface UserListTableProps {
  profiles: Profile[];
  onSort: (field: SortField) => void;
}

export function UserListTable({ profiles, onSort }: UserListTableProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const isSuperuser = user?.roles?.includes('superuser');

  return (
    <div className="bg-white/80 rounded-lg border border-primary/30 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/15 hover:bg-primary/20">
            <TableHead 
              onClick={() => onSort('name')} 
              className="cursor-pointer font-semibold text-primary whitespace-nowrap"
            >
              Nome <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
            </TableHead>
            {!isMobile && (
              <TableHead 
                onClick={() => onSort('company')} 
                className="cursor-pointer font-semibold text-primary whitespace-nowrap"
              >
                Empresa <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
              </TableHead>
            )}
            {isSuperuser && !isMobile && (
              <>
                <TableHead 
                  onClick={() => onSort('email')} 
                  className="cursor-pointer font-semibold text-primary whitespace-nowrap"
                >
                  Email <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
                <TableHead 
                  onClick={() => onSort('phone')} 
                  className="cursor-pointer font-semibold text-primary whitespace-nowrap"
                >
                  Celular <ArrowUpDown className="inline size-4 ml-1 text-primary/70" />
                </TableHead>
              </>
            )}
            <TableHead 
              onClick={() => onSort('created_at')} 
              className="cursor-pointer font-semibold text-primary whitespace-nowrap text-right"
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
              <TableCell className="font-medium">
                <div>
                  {profile.fullName}
                  {isMobile && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {profile.companyName}
                      {isSuperuser && (
                        <>
                          <div className="mt-1">{profile.email}</div>
                          <div>{profile.phone}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              {!isMobile && <TableCell>{profile.companyName}</TableCell>}
              {isSuperuser && !isMobile && (
                <>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                </>
              )}
              <TableCell className="text-right whitespace-nowrap">
                {format(new Date(profile.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
