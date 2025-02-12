
import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="text-white flex flex-col items-center gap-4 py-8">
      <Loader className="w-8 h-8 animate-spin" />
      <div className="text-xl">Carregando Produtos</div>
    </div>
  );
};
