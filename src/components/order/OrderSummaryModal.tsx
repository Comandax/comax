
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
import { FileText, Loader, X } from "lucide-react";
import type { OrderItem } from "@/types/order";
import { useState } from "react";

interface OrderSummaryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderItem[];
  total: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => Promise<void>;
  onRemoveItem?: (productId: string, size: string) => void;
}

export const OrderSummaryModal = ({
  isOpen,
  onOpenChange,
  items,
  total,
  notes,
  onNotesChange,
  onSubmit,
  onRemoveItem,
}: OrderSummaryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingItem, setRemovingItem] = useState<{ productId: string; size: string } | null>(null);
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    setRemovingItem({ productId, size });
    if (onRemoveItem) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Pequeno delay para mostrar o loading
      onRemoveItem(productId, size);
    }
    setRemovingItem(null);
  };

  const isRemoving = (productId: string, size: string) => {
    return removingItem?.productId === productId && removingItem?.size === size;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl w-[95%] md:w-full max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumo do Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 w-full md:overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell w-20">Ref.</TableHead>
                  <TableHead className="w-24 md:w-auto">Produto</TableHead>
                  <TableHead className="w-auto">Tamanhos</TableHead>
                  <TableHead className="w-20 text-right">Subtotal</TableHead>
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
                      <TableCell className="hidden md:table-cell whitespace-nowrap text-sm">{item.reference}</TableCell>
                      <TableCell className="whitespace-normal md:whitespace-nowrap text-sm break-words">{item.name}</TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="space-y-0">
                          {item.sizes.map((size, idx) => (
                            <div key={idx}>
                              <div className="text-sm flex flex-wrap items-center justify-between gap-2 py-2">
                                <span className="whitespace-nowrap">
                                  {size.size}: {size.quantity} un
                                </span>
                                {onRemoveItem && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 min-w-[90px]"
                                    onClick={() => handleRemoveItem(item.productId, size.size)}
                                    disabled={isRemoving(item.productId, size.size)}
                                  >
                                    {isRemoving(item.productId, size.size) ? (
                                      <>
                                        <Loader className="w-4 h-4 mr-1 animate-spin" />
                                        Removendo...
                                      </>
                                    ) : (
                                      <>
                                        <X className="w-4 h-4 mr-1" />
                                        Remover
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                              {idx < item.sizes.length - 1 && (
                                <div className="border-b border-gray-200"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap text-sm">
                        {formattedSubtotal}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold whitespace-normal px-2">
                    <span className="inline-block">Total do Pedido</span>
                  </TableCell>
                  <TableCell className="text-right font-bold whitespace-nowrap px-2">
                    {formattedTotal}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

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
