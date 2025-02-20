import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order } from "@/types/order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

const formatZipCode = (zipCode: string) => {
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return zipCode;
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

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <ScrollArea className="h-[80vh]">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Pedido</h3>
            <p>Código: {order._id}</p>
            <p>Data: {formatDate(order.date)}</p>
            <p>Hora: {order.time}</p>
            {order.notes && (
              <div className="mt-2">
                <h4 className="font-semibold mb-1">Observações:</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p>Nome: {order.customerName}</p>
            <p>Telefone: {formatPhoneNumber(order.customerPhone)}</p>
            <p>Cidade: {order.customerCity} / {order.customerState}</p>
            <p>CEP: {formatZipCode(order.customerZipCode)}</p>
          </div>
        </div>

        <div className="pr-[10px]">
          <h3 className="font-semibold mb-4">Itens do pedido</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={`${item.productId}`} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-3 font-semibold">
                  {item.reference} - {item.name}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.sizes.map((size, index) => (
                      <TableRow 
                        key={`${item.productId}-${size.size}-${index}`}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <TableCell>{size.size}</TableCell>
                        <TableCell>{size.quantity}</TableCell>
                        <TableCell className="text-right">
                          R$ {size.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right font-semibold pr-[20px]">
            Total do pedido: R$ {order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
