
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
import { FileText, Loader } from "lucide-react";
import type { OrderItem } from "@/types/order";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
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
            <Button 
              onClick={handleSubmit} 
              size="lg" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Enviando pedido
                </>
              ) : (
                "Enviar Pedido"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
