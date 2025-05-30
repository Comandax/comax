
import { Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
  onQuantitySelect: (size: string, quantity: number, price: number) => void;
  selectedQuantities: Record<string, number>;
  quantitySelectionMode?: 'radio' | 'select';
  resetItem?: { size: string; productId: string; };
}

export function ProductDetailsDialog({ 
  product, 
  onClose, 
  onQuantitySelect,
  selectedQuantities,
  quantitySelectionMode = 'radio',
  resetItem
}: ProductDetailsDialogProps) {
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(selectedQuantities);

  useEffect(() => {
    setLocalQuantities(selectedQuantities);
  }, [selectedQuantities]);

  useEffect(() => {
    if (resetItem && product && resetItem.productId === product._id) {
      setLocalQuantities(prev => ({
        ...prev,
        [resetItem.size]: 0
      }));
    }
  }, [resetItem, product]);

  if (!product) return null;

  const handleQuantityChange = (size: string, quantity: number, price: number) => {
    setLocalQuantities(prev => ({
      ...prev,
      [size]: quantity
    }));
    onQuantitySelect(size, quantity, price);
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product.reference} - {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {product.sizes.map((size, index) => (
              <div key={index}>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-24">
                    <span className="font-medium">{size.size}</span>
                  </div>
                  
                  <div className="flex-1">
                    {quantitySelectionMode === 'radio' ? (
                      <RadioGroup
                        value={localQuantities[size.size]?.toString() || "0"}
                        onValueChange={(value) => {
                          handleQuantityChange(size.size, Number(value), size.value);
                        }}
                        className="flex flex-wrap gap-3 justify-start"
                      >
                        {[0, ...product.quantities.map(q => q.value)].map((qty) => (
                          <div key={qty} className="flex items-center gap-1">
                            <RadioGroupItem 
                              value={qty.toString()} 
                              id={`${product._id}-${size.size}-${qty}`}
                              className="md:scale-75 scale-100"
                            />
                            <Label 
                              htmlFor={`${product._id}-${size.size}-${qty}`} 
                              className="text-xs cursor-pointer"
                            >
                              {qty}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Select
                        value={localQuantities[size.size]?.toString() || "0"}
                        onValueChange={(value) => {
                          handleQuantityChange(size.size, Number(value), size.value);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, ...product.quantities.map(q => q.value)].map((qty) => (
                            <SelectItem 
                              key={qty} 
                              value={qty.toString()} 
                              className="hover:bg-primary/10 transition-colors duration-150"
                            >
                              {qty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div className="w-24 text-right">
                    <span className="font-medium text-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(size.value)}
                    </span>
                  </div>
                </div>

                {index < product.sizes.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1 text-onPrimary"
            >
              Colocar na sacola
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
