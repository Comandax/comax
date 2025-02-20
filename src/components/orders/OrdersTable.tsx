import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Order } from "@/types/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type SortConfig = {
  column: 'customerName' | 'date' | 'total';
  direction: 'asc' | 'desc';
};

interface OrdersTableProps {
  orders: Order[];
  sortConfig: SortConfig;
  onSort: (column: SortConfig['column']) => void;
  onOrderClick: (order: Order) => void;
}

export const OrdersTable = ({ orders, sortConfig, onSort, onOrderClick }: OrdersTableProps) => {
  const getSortIcon = (column: SortConfig['column']) => {
    if (sortConfig.column === column) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="h-4 w-4 text-blue-500" />
      ) : (
        <ChevronDown className="h-4 w-4 text-blue-500" />
      );
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    try {
      // Dividir a data em partes
      const [year, month, day] = dateStr.split('-').map(Number);
      
      // Criar uma data às 12:00 (meio-dia) para evitar problemas de timezone
      const date = new Date(year, month - 1, day, 12, 0, 0);
      
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error, 'Data recebida:', dateStr);
      return dateStr;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-blue-50/50">
          <TableHead 
            className="cursor-pointer hover:text-blue-600"
            onClick={() => onSort('customerName')}
          >
            <div className="flex items-center gap-1">
              Cliente
              {getSortIcon('customerName')}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer hover:text-blue-600"
            onClick={() => onSort('date')}
          >
            <div className="flex items-center gap-1">
              Data
              {getSortIcon('date')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right cursor-pointer hover:text-blue-600"
            onClick={() => onSort('total')}
          >
            <div className="flex items-center justify-end gap-1">
              Total
              {getSortIcon('total')}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow 
            key={order._id} 
            className={`
              cursor-pointer 
              hover:bg-blue-50 
              ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}
            `}
            onClick={() => onOrderClick(order)}
          >
            <TableCell className="font-medium">{order.customerName}</TableCell>
            <TableCell>{formatDate(order.date)} às {order.time}</TableCell>
            <TableCell className="text-right">R$ {order.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
