
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";

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
    }>;
  };
  onQuantitySelect: (size: string, quantity: number, price: number) => void;
  resetItem?: { size: string; productId: string; };
}

export const ProductCard = ({ product, onQuantitySelect, resetItem }: ProductCardProps) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (resetItem && resetItem.productId === product.id) {
      setSelectedQuantities(prev => ({
        ...prev,
        [resetItem.size]: 0
      }));
    }
  }, [resetItem, product.id]);

  const handleQuantityChange = (size: string, quantity: number, price: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [size]: quantity
    }));
    onQuantitySelect(size, quantity, price);
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
    <Card className="p-6 bg-white/90 shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
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
          <div className="mt-2 text-center">
            <h3 className="text-lg font-semibold">Ref: {product.ref}</h3>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="grid grid-cols-[80px_1fr_60px] gap-4 text-sm font-medium text-gray-700 mb-2">
            <div>Tamanho</div>
            <div>Quantidades</div>
            <div>Subtotal</div>
          </div>
          
          {product.sizes.map((size, index) => (
            <div key={size.label}>
              <div className={`mb-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                <div className="grid grid-cols-[80px_1fr_60px] gap-4 items-center p-2">
                  <div>
                    <span className="font-medium text-sm">{size.label}</span>
                    <div className="text-xs text-gray-500">{formatCurrency(size.price)}</div>
                  </div>
                  
                  <RadioGroup
                    value={selectedQuantities[size.label]?.toString() || "0"}
                    onValueChange={(value) => {
                      handleQuantityChange(size.label, Number(value), size.price);
                    }}
                    className="grid grid-cols-6 gap-3"
                  >
                    {size.quantities.map((qty) => (
                      <div key={qty} className="flex flex-col items-center gap-1">
                        <RadioGroupItem 
                          value={qty.toString()} 
                          id={`${size.label}-${qty}`} 
                          className="md:scale-75 scale-125"
                        />
                        <Label htmlFor={`${size.label}-${qty}`} className="text-xs">{qty}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="text-right text-xs font-medium text-gray-600">
                    {formatCurrency(calculateSubtotal(size.label, size.price))}
                  </div>
                </div>
              </div>
              {index < product.sizes.length - 1 && (
                <Separator className="my-4 opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
