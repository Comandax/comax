
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
import { ArrowLeft } from "lucide-react";
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

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { company } = useCompany();
  const navigate = useNavigate();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", company?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("company_id", company?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return data.map((order: any) => ({
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
      }));
    },
    enabled: !!company?.id,
  });

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

      <h1 className="text-3xl font-bold mb-6">Relatório de Pedidos</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
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

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          {selectedOrder && <OrderDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
