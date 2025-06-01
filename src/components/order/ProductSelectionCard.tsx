import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Package } from "lucide-react";

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
    }>;
    outOfStock?: boolean;
  };
  onQuantitySelect: (size: string, quantity: number, price: number) => void;
  resetItem?: { size: string; productId: string; };
}

export const ProductSelectionCard = ({ product, onQuantitySelect, resetItem }: ProductSelectionCardProps) => {
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
    if (product.outOfStock) return;
    
    setSelectedQuantities(prev => ({
      ...prev,
      [size]: quantity
    }));
    onQuantitySelect(size, quantity, price);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className={`p-4 shadow-md relative ${product.outOfStock ? 'bg-gray-50 opacity-75' : 'bg-white/90'}`}>
      {product.outOfStock && (
        <div className="absolute top-2 right-2 z-10">
          <p className="text-xs font-medium text-gray-600">Sem estoque no momento</p>
        </div>
      )}
      
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
            {product.sizes.map((size) => (
              <div key={size.label} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{size.label}</span>
                  <span className="text-xs text-gray-500">{formatCurrency(size.price)}</span>
                </div>
                
                <RadioGroup
                  value={selectedQuantities[size.label]?.toString() || "0"}
                  onValueChange={(value) => {
                    handleQuantityChange(size.label, Number(value), size.price);
                  }}
                  className="grid grid-cols-3 gap-2"
                >
                  {size.quantities.map((qty) => (
                    <div key={qty} className="flex items-center gap-1">
                      <RadioGroupItem 
                        value={qty.toString()} 
                        id={`${size.label}-${qty}-compact`}
                        className="scale-75"
                      />
                      <Label 
                        htmlFor={`${size.label}-${qty}-compact`} 
                        className="text-xs"
                      >
                        {qty}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
