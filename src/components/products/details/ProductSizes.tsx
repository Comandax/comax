
interface Size {
  size: string;
  value: number;
}

interface ProductSizesProps {
  sizes: Size[];
}

export function ProductSizes({ sizes }: ProductSizesProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Tamanhos e Valores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sizes.map((size, index) => (
          <div 
            key={index} 
            className="flex justify-between p-2 bg-muted rounded-lg border border-primary/30"
          >
            <span className="text-sm font-medium">{size.size}</span>
            <span className="text-sm text-muted-foreground">
              R$ {size.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
