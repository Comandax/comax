
import { X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderItem } from "@/types/order";

interface OrderSummaryTableProps {
  items: OrderItem[];
  total: number;
  onRemoveItem?: (productId: string, size: string) => void;
  removingItem: { productId: string; size: string } | null;
}

export const OrderSummaryTable = ({ 
  items, 
  total, 
  onRemoveItem,
  removingItem 
}: OrderSummaryTableProps) => {
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);

  const isRemoving = (productId: string, size: string) => {
    return removingItem?.productId === productId && removingItem?.size === size;
  };

  return (
    <div className="w-full overflow-hidden flex flex-col">
      <div className="w-full min-w-[300px] overflow-auto max-h-[40vh] pr-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell w-20">Ref.</TableHead>
              <TableHead className="w-[250px] md:w-auto">Produto</TableHead>
              <TableHead className="w-auto">Tamanhos</TableHead>
              <TableHead className="w-20 text-right whitespace-nowrap">Subtotal</TableHead>
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
                  <TableCell className="text-sm max-w-[250px] md:max-w-none break-words">{item.name}</TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="space-y-0">
                      {item.sizes.map((size, idx) => (
                        <div key={idx}>
                          <div className="text-sm flex flex-wrap items-center justify-between gap-1 py-1">
                            <span className="whitespace-nowrap text-xs md:text-sm">
                              {size.size}: {size.quantity} un
                            </span>
                            {onRemoveItem && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1 md:px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onRemoveItem(item.productId, size.size)}
                                disabled={isRemoving(item.productId, size.size)}
                              >
                                {isRemoving(item.productId, size.size) ? (
                                  <>
                                    <Loader className="w-3 h-3 md:w-4 md:h-4 mr-1 animate-spin" />
                                    <span className="text-xs md:text-sm">Removendo...</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                    <span className="text-xs md:text-sm">Remover</span>
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                          {idx < item.sizes.length - 1 && (
                            <div className="border-b border-gray-300"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap text-xs md:text-sm">
                    {formattedSubtotal}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="text-right pr-4">
          <span className="text-sm md:text-base font-semibold">
            Total do Pedido: {formattedTotal}
          </span>
        </div>
      </div>
    </div>
  );
};
