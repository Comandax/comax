
import { Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 relative">
      <button
        onClick={() => navigate("/admin")}
        className="absolute right-4 top-4 p-2 text-white hover:text-white/80 transition-colors"
        title="Painel Administrativo"
      >
        <Settings2 size={24} />
      </button>
      
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-white text-lg mb-8">Por favor, verifique se o endereço está correto.</p>
        </div>
      </div>
    </div>
  );
};
