
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { OrderNotes } from "@/components/OrderNotes";
import type { OrderItem } from "@/types/order";
import { useState, useRef, useEffect } from "react";
import { OrderSummaryHeader } from "./summary/OrderSummaryHeader";
import { OrderSummaryTable } from "./summary/OrderSummaryTable";
import { OrderSummaryFooter } from "./summary/OrderSummaryFooter";

interface OrderSummaryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderItem[];
  total: number;
  futureTotal?: number;
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
  futureTotal = 0,
  notes,
  onNotesChange,
  onSubmit,
  onRemoveItem,
}: OrderSummaryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingItem, setRemovingItem] = useState<{ productId: string; size: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      await new Promise(resolve => setTimeout(resolve, 500));
      onRemoveItem(productId, size);
    }
    setRemovingItem(null);
  };

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (contentRef.current && e.target instanceof HTMLTextAreaElement) {
        setTimeout(() => {
          const element = e.target as HTMLTextAreaElement;
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('focusin', handleFocus);
      return () => content.removeEventListener('focusin', handleFocus);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        ref={contentRef}
        className="max-w-3xl w-[95%] md:w-full max-h-[90vh] p-3 md:p-6 flex flex-col overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby="order-summary-description"
      >
        <div id="order-summary-description" className="sr-only">
          Resumo do pedido contendo lista de produtos selecionados, quantidades, tamanhos e valor total
        </div>
        
        {/* Header e footer fixos; só o miolo rola. Antes a rolagem ficava dentro da
            tabela, o que cortava a seção de entrega futura e empurrava as observações
            para fora da área visível do modal. */}
        <div className="flex flex-col min-h-0 flex-1">
          <OrderSummaryHeader />

          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1">
            <OrderSummaryTable
              items={items}
              total={total}
              futureTotal={futureTotal}
              onRemoveItem={handleRemoveItem}
              removingItem={removingItem}
            />

            <OrderNotes value={notes} onChange={onNotesChange} />
          </div>

          <div className="pt-4 mt-2 border-t shrink-0">
            <OrderSummaryFooter
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
