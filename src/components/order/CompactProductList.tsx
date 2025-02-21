
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/product";

interface CompactProductListProps {
  products: Product[];
  onQuantitySelect: (productId: string, size: string, quantity: number, price: number) => void;
  resetItem?: { size: string; productId: string; };
}

export function CompactProductList({ products, onQuantitySelect, resetItem }: CompactProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Reset quantities when opening modal
    setSelectedQuantities({});
  };

  const handleQuantityChange = (size: string, quantity: number, price: number) => {
    if (!selectedProduct) return;

    setSelectedQuantities(prev => ({
      ...prev,
      [size]: quantity
    }));

    onQuantitySelect(selectedProduct._id, size, quantity, price);
  };

  const handleAddToCart = () => {
    setSelectedProduct(null);
  };

  const activeProducts = products
    .filter(product => !product.disabled)
    .sort((a, b) => {
      // Sort by isNew first, then by reference
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return a.reference.localeCompare(b.reference);
    });

  if (!activeProducts.length) {
    return (
      <div className="text-center p-8">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum produto disponível</h3>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeProducts.map((product) => (
          <Card 
            key={product._id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleProductClick(product)}
          >
            <div className="p-4">
              {product.isNew && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-onPrimary mb-2">
                  Novo
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
              <p className="text-sm text-gray-500">{product.name}</p>
              <div className="mt-2 space-y-1">
                {product.sizes.map((size, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{size.size}</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(size.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedProduct.reference} - {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden">
                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedProduct.sizes.map((size, index) => (
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
                          handleQuantityChange(size.size, Number(value), size.value);
                        }}
                        className="grid grid-cols-6 gap-3"
                      >
                        {[0, ...selectedProduct.quantities.map(q => q.value)].map((qty) => (
                          <div key={qty} className="flex flex-col items-center gap-1">
                            <RadioGroupItem 
                              value={qty.toString()} 
                              id={`${selectedProduct._id}-${size.size}-${qty}`}
                              className="md:scale-75 scale-125"
                            />
                            <Label 
                              htmlFor={`${selectedProduct._id}-${size.size}-${qty}`} 
                              className="text-xs cursor-pointer"
                            >
                              {qty}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="mt-4"
                >
                  Colocar na sacola
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
