
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
  futureTotal?: number;
  onRemoveItem?: (productId: string, size: string) => void;
  removingItem: { productId: string; size: string } | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

/**
 * Um mesmo produto pode ter tamanhos disponíveis e de entrega futura, então a
 * separação é por tamanho: o produto aparece nas duas seções quando for o caso.
 */
const filterItemsBySizes = (items: OrderItem[], wantFuture: boolean): OrderItem[] =>
  items
    .map(item => ({
      ...item,
      sizes: item.sizes.filter(size => Boolean(size.futureDelivery) === wantFuture)
    }))
    .filter(item => item.sizes.length > 0);

interface SectionProps {
  title: string;
  subtitle?: string;
  items: OrderItem[];
  sectionTotal: number;
  onRemoveItem?: (productId: string, size: string) => void;
  removingItem: { productId: string; size: string } | null;
  highlighted?: boolean;
}

const OrderSection = ({
  title,
  subtitle,
  items,
  sectionTotal,
  onRemoveItem,
  removingItem,
  highlighted = false
}: SectionProps) => {
  const isRemoving = (productId: string, size: string) =>
    removingItem?.productId === productId && removingItem?.size === size;

  return (
    <div className={highlighted ? "rounded-md border border-amber-300 bg-amber-50/40 p-2" : ""}>
      <div className="mb-1 px-1">
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${highlighted ? "text-amber-800" : "text-gray-700"}`}>
          {title}
        </h4>
        {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell w-20">Ref.</TableHead>
            <TableHead className="w-auto">Produto</TableHead>
            <TableHead className="w-auto">Tamanhos</TableHead>
            <TableHead className="w-16 md:w-20 text-right whitespace-nowrap">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const itemTotal = item.sizes.reduce((acc, size) => acc + size.subtotal, 0);

            return (
              <TableRow key={item.productId}>
                <TableCell className="hidden md:table-cell whitespace-nowrap text-sm">{item.reference}</TableCell>
                <TableCell className="text-xs md:text-sm break-words">{item.name}</TableCell>
                <TableCell className="min-w-[100px] md:min-w-[120px]">
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
                  {formatCurrency(itemTotal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="text-right pr-4 pt-1">
        <span className="text-xs md:text-sm text-gray-600">
          Subtotal: <span className="font-medium">{formatCurrency(sectionTotal)}</span>
        </span>
      </div>
    </div>
  );
};

export const OrderSummaryTable = ({
  items,
  total,
  futureTotal = 0,
  onRemoveItem,
  removingItem
}: OrderSummaryTableProps) => {
  const availableItems = filterItemsBySizes(items, false);
  const futureItems = filterItemsBySizes(items, true);
  const hasFutureItems = futureItems.length > 0;

  return (
    <div className="w-full flex flex-col">
      {/* A rolagem é do modal, não daqui: aninhar duas áreas roláveis cortava a
          seção de entrega futura ao meio. */}
      <div className="w-full space-y-4">
        {availableItems.length > 0 && (
          <OrderSection
            title="Disponíveis para entrega"
            items={availableItems}
            sectionTotal={total}
            onRemoveItem={onRemoveItem}
            removingItem={removingItem}
          />
        )}

        {hasFutureItems && (
          <OrderSection
            title="Entrega futura"
            subtitle="Sujeito a disponibilidade"
            items={futureItems}
            sectionTotal={futureTotal}
            onRemoveItem={onRemoveItem}
            removingItem={removingItem}
            highlighted
          />
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="text-right pr-4 space-y-1">
          <div className="text-sm md:text-base font-semibold">
            Total do Pedido: {formatCurrency(total)}
          </div>
          {hasFutureItems && (
            <>
              <div className="text-xs md:text-sm text-amber-800">
                Entrega futura: {formatCurrency(futureTotal)}
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Total geral: {formatCurrency(total + futureTotal)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
