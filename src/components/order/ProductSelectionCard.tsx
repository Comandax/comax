
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { isSizeAvailable } from "@/lib/availability";
import { FutureDeliveryBadge, FutureDeliveryNotice } from "./FutureDeliveryBadge";
import { FutureDeliveryDialog } from "./FutureDeliveryDialog";
import { useFutureDeliveryConfirm } from "./useFutureDeliveryConfirm";

interface ProductSelectionCardProps {
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

export const ProductSelectionCard = ({ product, onQuantitySelect, resetItem }: ProductSelectionCardProps) => {
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className={`p-4 shadow-md relative ${product.outOfStock ? 'bg-gray-50 opacity-75' : 'bg-white/90'}`}>
      <div className="space-y-4">
        <div className="text-center">
          <div className="relative">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400">
                <Package className="w-8 h-8" />
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold mt-2">Ref: {product.ref}</h3>
          <p className={`text-xs ${product.outOfStock ? 'text-gray-500' : 'text-gray-600'}`}>{product.name}</p>
        </div>
        
        {product.outOfStock ? (
          <div className="text-center py-6">
            <p className="text-sm font-medium text-gray-600">Sem estoque no momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allSizesUnavailable && <FutureDeliveryNotice />}

            {product.sizes.map((size) => {
              const available = isSizeAvailable(size);

              return (
              <div key={size.label} className={`border rounded-lg p-3 ${available ? '' : 'border-amber-300 bg-amber-50/40'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{size.label}</span>
                  <span className="text-xs text-gray-500">{formatCurrency(size.price)}</span>
                </div>

                {/* Com todos os tamanhos indisponíveis o aviso do topo já informa; o badge seria ruído. */}
                {!available && !allSizesUnavailable && (
                  <div className="mb-2">
                    <FutureDeliveryBadge />
                  </div>
                )}

                <RadioGroup
                  value={selectedQuantities[size.label]?.toString() || "0"}
                  onValueChange={(value) => {
                    handleQuantityChange(size.label, Number(value), size.price, available);
                  }}
                  className="flex flex-wrap gap-x-3 gap-y-2"
                >
                  {/* O 0 permite desmarcar o tamanho, como já acontece no modo select. */}
                  {[0, ...size.quantities].map((qty) => (
                    <div key={qty} className="flex items-center gap-1">
                      <RadioGroupItem
                        value={qty.toString()}
                        id={`${product.id}-${size.label}-${qty}-compact`}
                        className="scale-75"
                      />
                      <Label
                        htmlFor={`${product.id}-${size.label}-${qty}-compact`}
                        className="text-xs cursor-pointer"
                      >
                        {qty}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              );
            })}
          </div>
        )}
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
