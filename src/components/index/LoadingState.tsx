
import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
      <div className="text-white flex flex-col items-center gap-4">
        <Loader className="w-8 h-8 animate-spin" />
        <div className="text-xl">Carregando Produtos</div>
      </div>
    </div>
  );
};
