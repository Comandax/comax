
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { Order } from "@/types/order";

interface OrdersTableProps {
  orders: Order[];
  sortConfig: {
    column: 'customerName' | 'date' | 'total';
    direction: 'asc' | 'desc';
  };
  onSort: (column: 'customerName' | 'date' | 'total') => void;
  onOrderClick: (order: Order) => void;
}

const SortIcon = ({ 
  column, 
  currentColumn, 
  direction 
}: { 
  column: 'customerName' | 'date' | 'total';
  currentColumn: 'customerName' | 'date' | 'total';
  direction: 'asc' | 'desc';
}) => {
  if (column !== currentColumn) {
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  }
  return direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
};

export const OrdersTable = ({ orders, sortConfig, onSort, onOrderClick }: OrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100/80 hover:bg-gray-100/90">
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => onSort('customerName')} 
              className="hover:bg-transparent font-semibold"
            >
              Cliente
              <SortIcon 
                column="customerName" 
                currentColumn={sortConfig.column} 
                direction={sortConfig.direction} 
              />
            </Button>
          </TableHead>
          <TableHead>
            <Button 
              variant="ghost" 
              onClick={() => onSort('date')} 
              className="hover:bg-transparent font-semibold"
            >
              Data/Hora
              <SortIcon 
                column="date" 
                currentColumn={sortConfig.column} 
                direction={sortConfig.direction} 
              />
            </Button>
          </TableHead>
          <TableHead className="text-right">
            <Button 
              variant="ghost" 
              onClick={() => onSort('total')} 
              className="hover:bg-transparent font-semibold ml-auto"
            >
              Total
              <SortIcon 
                column="total" 
                currentColumn={sortConfig.column} 
                direction={sortConfig.direction} 
              />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <TableRow 
            key={order._id} 
            className={`cursor-pointer hover:bg-gray-100/70 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'
            }`} 
            onClick={() => onOrderClick(order)}
          >
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              {order.date} às {order.time.substring(0, 5)}
            </TableCell>
            <TableCell className="text-right">
              R$ {order.total.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
