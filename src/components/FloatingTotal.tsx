interface FloatingTotalProps {
  total: number;
}

export const FloatingTotal = ({ total }: FloatingTotalProps) => {
  if (total <= 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 animate-float-in">
      <div className="text-lg font-semibold">Total do Pedido</div>
      <div className="text-2xl font-bold text-primary">
        R$ {total.toFixed(2)}
      </div>
    </div>
  );
};