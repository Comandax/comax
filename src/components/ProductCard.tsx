import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useState } from "react";

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
}

export const ProductCard = ({ product, onQuantitySelect }: ProductCardProps) => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

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

  return (
    <Card className="p-6 bg-white/90 shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
          <div className="mt-2 text-center">
            <h3 className="text-lg font-semibold">Ref: {product.ref}</h3>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700 mb-2">
            <div>Tamanho</div>
            <div>Quantidades</div>
            <div>Subtotal</div>
          </div>
          
          {product.sizes.map((size) => (
            <div key={size.label} className="mb-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <span className="font-medium">{size.label}</span>
                  <div className="text-sm text-gray-500">R$ {size.price.toFixed(2)}</div>
                </div>
                
                <RadioGroup
                  value={selectedQuantities[size.label]?.toString()}
                  onValueChange={(value) => {
                    handleQuantityChange(size.label, Number(value), size.price);
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {size.quantities.map((qty) => (
                    <div key={qty} className="flex items-center space-x-2">
                      <RadioGroupItem value={qty.toString()} id={`${size.label}-${qty}`} />
                      <Label htmlFor={`${size.label}-${qty}`}>{qty}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="text-right font-medium">
                  R$ {calculateSubtotal(size.label, size.price).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};