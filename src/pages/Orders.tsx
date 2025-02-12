
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowUpDown,
  Search,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Order } from "@/types/order";
import { useCompany } from "@/hooks/useCompany";
import { supabase } from "@/integrations/supabase/client";

const OrderDetails = ({ order }: { order: Order }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Pedido</h3>
          <p>Código: {order._id}</p>
          <p>Data: {order.date}</p>
          <p>Hora: {order.time}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Cliente</h3>
          <p>Nome: {order.customerName}</p>
          <p>Telefone: {order.customerPhone}</p>
          <p>Cidade: {order.customerCity}</p>
          <p>CEP: {order.customerZipCode}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Itens do pedido</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código - Tamanho</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  R$ {item.subtotal.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="text-right font-semibold">
                Total do pedido:
              </TableCell>
              <TableCell className="text-right font-semibold">
                R$ {order.total.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

type SortConfig = {
  column: 'customerName' | 'date' | 'total';
  direction: 'asc' | 'desc';
};

type OrdersQueryResult = {
  orders: Order[];
  totalCount: number;
};

const PAGE_SIZES = [10, 20, 50, 100];

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'date',
    direction: 'desc'
  });
  
  const { company } = useCompany();
  const navigate = useNavigate();

  const { data: ordersData } = useQuery<OrdersQueryResult>({
    queryKey: ["orders", company?.id, searchTerm, sortConfig, currentPage, pageSize],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*", { count: 'exact' })
        .eq("company_id", company?.id);

      // Apply search filter if search term exists
      if (searchTerm) {
        query = query.ilike('customer_name', `%${searchTerm}%`);
      }

      // Apply sorting
      const column = sortConfig.column === 'customerName' ? 'customer_name' : 
                    sortConfig.column === 'date' ? 'date' : 'total';
      query = query.order(column, { ascending: sortConfig.direction === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return {
        orders: data.map((order: any) => ({
          _id: order.id,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerCity: order.customer_city,
          customerZipCode: order.customer_zip_code,
          date: new Date(order.date).toLocaleDateString(),
          time: order.time,
          items: order.items,
          total: order.total,
          companyId: order.company_id,
        })),
        totalCount: count || 0,
      };
    },
    enabled: !!company?.id,
  });

  const totalPages = Math.ceil((ordersData?.totalCount || 0) / pageSize);

  const handleSort = (column: SortConfig['column']) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/80"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para o painel
        </Button>
      </div>

      <Card 
        className="p-6 mb-8 bg-white/90 cursor-pointer hover:bg-white/95 transition-colors"
        onClick={() => navigate("/admin")}
      >
        <div className="flex items-center gap-4">
          {company.logo_url && (
            <img 
              src={company.logo_url} 
              alt={`${company.name} logo`}
              className="w-16 h-16 object-contain rounded-lg"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Relatório de Pedidos</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} itens
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('customerName')}
                className="hover:bg-transparent"
              >
                Cliente
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('date')}
                className="hover:bg-transparent"
              >
                Data
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort('total')}
                className="hover:bg-transparent"
              >
                Total
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData?.orders.map((order) => (
            <TableRow
              key={order._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedOrder(order)}
            >
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell className="text-right">
                R$ {order.total.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
