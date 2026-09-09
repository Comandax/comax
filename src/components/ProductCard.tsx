
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Package, Star } from "lucide-react";
import { isSizeAvailable } from "@/lib/availability";
import { FutureDeliveryBadge, FutureDeliveryNotice } from "@/components/order/FutureDeliveryBadge";
import { FutureDeliveryDialog } from "@/components/order/FutureDeliveryDialog";
import { useFutureDeliveryConfirm } from "@/components/order/useFutureDeliveryConfirm";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    ref: string;
    sizes: Array<{
      label: string;
      price: number;
      quantities: number[];
      available?: boolean;
    }>;
    outOfStock?: boolean;
  };
  onQuantitySelect: (size: string, quantity: number, price: number, futureDelivery?: boolean) => void;
  resetItem?: { size: string; productId: string; };
}

export const ProductCard = ({ product, onQuantitySelect, resetItem }: ProductCardProps) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const futureDelivery = useFutureDeliveryConfirm();
  const { forgetConfirmation } = futureDelivery;
  const allSizesUnavailable =
    product.sizes.length > 0 && product.sizes.every(size => !isSizeAvailable(size));

  useEffect(() => {
    if (resetItem && resetItem.productId === product.id) {
      setSelectedQuantities(prev => ({
        ...prev,
        [resetItem.size]: 0
      }));
      forgetConfirmation(resetItem.size);
    }
  }, [resetItem, product.id, forgetConfirmation]);

  const applyQuantityChange = (size: string, quantity: number, price: number, isFuture: boolean) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [size]: quantity
    }));
    onQuantitySelect(size, quantity, price, isFuture);
  };

  const handleQuantityChange = (size: string, quantity: number, price: number, available: boolean) => {
    if (product.outOfStock) return;

    // A seleção só é aplicada após a confirmação; cancelar mantém o valor anterior.
    futureDelivery.requestChange(size, available, () =>
      applyQuantityChange(size, quantity, price, !available)
    );
  };

  const calculateSubtotal = (size: string, price: number) => {
    const quantity = selectedQuantities[size] || 0;
    return quantity * price;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className={`p-6 shadow-md relative ${product.outOfStock ? 'bg-gray-50 opacity-75' : 'bg-white/90'}`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="relative">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400">
                <Package className="w-16 h-16" />
              </div>
            )}
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-lg font-semibold">Ref: {product.ref}</h3>
            <p className={`${product.outOfStock ? 'text-gray-500' : 'text-gray-600'}`}>{product.name}</p>
          </div>
        </div>
        
        <div className="md:w-1/2">
          {product.outOfStock ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600">Sem estoque no momento</p>
              </div>
            </div>
          ) : (
            <>
              {allSizesUnavailable && (
                <div className="mb-3">
                  <FutureDeliveryNotice />
                </div>
              )}

              <div className="grid grid-cols-[minmax(56px,auto)_1fr_minmax(56px,auto)] gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-700 mb-2 bg-gray-400 p-2 rounded-md">
                <div>Tamanho</div>
                <div>Quantidades</div>
                <div className="text-right">Subtotal</div>
              </div>

              {product.sizes.map((size, index) => {
                const available = isSizeAvailable(size);

                return (
                <div key={size.label}>
                  <div className={`mb-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                    <div className="grid grid-cols-[minmax(56px,auto)_1fr_minmax(56px,auto)] gap-2 md:gap-4 items-center p-2">
                      <div className="min-w-0">
                        <span className="font-medium text-sm">{size.label}</span>
                        <div className="text-xs text-gray-500 whitespace-nowrap">{formatCurrency(size.price)}</div>
                        {/* Com todos os tamanhos indisponíveis o aviso do topo já informa; o badge seria ruído. */}
                        {!available && !allSizesUnavailable && (
                          <FutureDeliveryBadge className="mt-1" />
                        )}
                      </div>

                      {/* Flex com wrap em vez de colunas fixas: com muitas quantidades as
                          opções quebram para a linha seguinte em vez de se sobrepor. */}
                      <RadioGroup
                        value={selectedQuantities[size.label]?.toString() || "0"}
                        onValueChange={(value) => {
                          handleQuantityChange(size.label, Number(value), size.price, available);
                        }}
                        className="flex flex-wrap justify-center gap-x-3 gap-y-2 md:gap-x-2"
                      >
                        {/* O 0 permite desmarcar o tamanho, como já acontece no modo select. */}
                        {[0, ...size.quantities].map((qty) => (
                          <div key={qty} className="flex flex-col items-center gap-1 min-w-[28px]">
                            <RadioGroupItem
                              value={qty.toString()}
                              id={`${product.id}-${size.label}-${qty}`}
                              className="md:scale-75"
                            />
                            <Label
                              htmlFor={`${product.id}-${size.label}-${qty}`}
                              className="text-xs cursor-pointer"
                            >
                              {qty}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="text-right text-xs font-medium text-gray-600 whitespace-nowrap">
                        {formatCurrency(calculateSubtotal(size.label, size.price))}
                      </div>
                    </div>
                  </div>
                  {index < product.sizes.length - 1 && (
                    <Separator className="my-4 opacity-50" />
                  )}
                </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <FutureDeliveryDialog
        open={futureDelivery.isDialogOpen}
        productName={product.name}
        size={futureDelivery.pendingSize ?? ""}
        onConfirm={futureDelivery.confirm}
        onCancel={futureDelivery.cancel}
      />
    </Card>
  );
};
