
interface ProductQuantitiesProps {
  quantities: number[];
}

export function ProductQuantities({ quantities }: ProductQuantitiesProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Quantidades Disponíveis</h3>
      <div className="flex flex-wrap gap-2">
        {quantities.map((qty, index) => (
          <span
            key={index}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {qty} un
          </span>
        ))}
      </div>
    </div>
  );
}
