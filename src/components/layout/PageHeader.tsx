
import React from "react";
import { Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center relative">
      <button
        onClick={() => navigate("/admin")}
        className="absolute right-0 top-0 p-2 text-white hover:text-white/80 transition-colors"
        title="Painel Administrativo"
      >
        <Settings2 size={24} />
      </button>
      <img
        src="/lovable-uploads/aa777edd-491a-43ae-aee4-5444b6657060.png"
        alt="Logo"
        className="w-32 h-32 mx-auto"
      />
      <h1 className="text-3xl font-bold text-white mt-4">Simulações e Pedidos</h1>
    </div>
  );
};

