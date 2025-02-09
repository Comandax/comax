
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Order } from "@/types/order";

const mockOrders: Order[] = [
  {
    _id: "1da1c",
    customerName: "Antonia Barros",
    date: "2025-02-05",
    time: "19:02",
    customerPhone: "9999139-4891",
    customerCity: "Barra do Corda/MA",
    customerZipCode: "65950-000",
    items: [
      {
        _id: "1",
        code: "2020-M",
        name: "Cueca Infantil Slip",
        size: "M",
        quantity: 6,
        subtotal: 35.76
      },
      // Adicione mais itens conforme necessário
    ],
    total: 557.28
  }
];

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

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => Promise.resolve(mockOrders),
  });

  return (
    <div className="container mx-auto py-10">
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
