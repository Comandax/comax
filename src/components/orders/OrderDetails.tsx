
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { OrderWithItems } from "@/types/order";

interface OrderDetailsProps {
  order: OrderWithItems;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  // Para converter a data UTC do banco para o fuso horário local (Brasília)
  const formatOrderDateTime = (dateStr: string, timeStr: string) => {
    // Combina a data e hora em um único string ISO
    const dateTimeStr = `${dateStr}T${timeStr}:00-03:00`;
    const orderDate = new Date(dateTimeStr);

    return {
      formattedDate: format(orderDate, "dd/MM/yyyy", { locale: ptBR }),
      formattedTime: format(orderDate, "HH:mm:ss", { locale: ptBR })
    };
  };

  const { formattedDate, formattedTime } = formatOrderDateTime(order.date, order.time);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data</Label>
                <p className="text-sm">{formattedDate}</p>
              </div>
              <div>
                <Label>Hora</Label>
                <p className="text-sm">{formattedTime}</p>
              </div>
            </div>
            <div>
              <Label>Cliente</Label>
              <p className="text-sm">{order.customer_name}</p>
            </div>
            <div>
              <Label>WhatsApp</Label>
              <p className="text-sm">{order.customer_phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cidade</Label>
                <p className="text-sm">{order.customer_city}</p>
              </div>
              <div>
                <Label>Estado</Label>
                <p className="text-sm">{order.customer_state}</p>
              </div>
            </div>
            <div>
              <Label>CEP</Label>
              <p className="text-sm">{order.customer_zip_code}</p>
            </div>
            {order.notes && (
              <div>
                <Label>Observações</Label>
                <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
            <div>
              <Label>Total do Pedido</Label>
              <p className="text-sm">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(order.total)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
