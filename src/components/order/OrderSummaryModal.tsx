
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderNotes } from "@/components/OrderNotes";
import { FileText } from "lucide-react";
import type { OrderItem } from "@/types/order";

interface OrderSummaryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderItem[];
  total: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
}

export const OrderSummaryModal = ({
  isOpen,
  onOpenChange,
  items,
  total,
  notes,
  onNotesChange,
  onSubmit,
}: OrderSummaryModalProps) => {
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumo do Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Tamanhos</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const itemTotal = item.sizes.reduce((acc, size) => acc + size.subtotal, 0);
                const formattedSubtotal = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(itemTotal);

                return (
                  <TableRow key={item.productId}>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {item.sizes.map((size, idx) => (
                          <div key={idx} className="text-sm">
                            {size.size}: {size.quantity} un x R$ {size.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formattedSubtotal}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Total do Pedido
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formattedTotal}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <OrderNotes value={notes} onChange={onNotesChange} />

          <div className="flex justify-end">
            <Button onClick={onSubmit} size="lg">
              Enviar Pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
