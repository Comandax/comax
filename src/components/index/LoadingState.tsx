
import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Loader className="w-8 h-8 animate-spin text-gray-600" />
      <div className="text-xl text-gray-600">Carregando Produtos</div>
    </div>
  );
};
