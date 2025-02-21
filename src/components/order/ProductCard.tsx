
import { Card } from "@/components/ui/card";
import { Package, Rocket, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  hasInCart: boolean;
}

export function ProductCard({ product, onSelect, hasInCart }: ProductCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={() => onSelect(product)}
    >
      {hasInCart && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-primary rounded-full p-2">
            <ShoppingBag className="h-6 w-6 text-onPrimary" />
          </div>
        </div>
      )}
      <div className="p-4">
        {product.isNew && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-onPrimary mb-2">
            <Rocket className="h-3 w-3" />
            Lançamento
          </span>
        )}
        <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium">Ref: {product.reference}</h3>
        <p className="text-sm text-gray-500 mb-3">{product.name}</p>
        <div className="space-y-2">
          {product.sizes.map((size, index) => (
            <div key={index}>
              <div className="grid grid-cols-[30%_1fr] gap-2 text-sm">
                <span className="text-gray-600">{size.size}</span>
                <span className="font-medium text-left">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(size.value)}
                </span>
              </div>
              {index < product.sizes.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
