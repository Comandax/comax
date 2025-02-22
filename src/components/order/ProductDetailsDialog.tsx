
import { Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/product";

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
  onQuantitySelect: (size: string, quantity: number, price: number) => void;
  selectedQuantities: Record<string, number>;
}

export function ProductDetailsDialog({ 
  product, 
  onClose, 
  onQuantitySelect,
  selectedQuantities
}: ProductDetailsDialogProps) {
  if (!product) return null;

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
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{size.size}</span>
                  <span className="font-medium text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(size.value)}
                  </span>
                </div>
                
                <RadioGroup
                  value={selectedQuantities[size.size]?.toString() || "0"}
                  onValueChange={(value) => {
                    onQuantitySelect(size.size, Number(value), size.value);
                  }}
                  className="grid grid-cols-6 gap-3"
                >
                  {[0, ...product.quantities.map(q => q.value)].map((qty) => (
                    <div key={qty} className="flex flex-col items-center gap-1">
                      <RadioGroupItem 
                        value={qty.toString()} 
                        id={`${product._id}-${size.size}-${qty}`}
                        className="md:scale-75 scale-125"
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
