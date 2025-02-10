
import React from "react";
import { Button } from "@/components/ui/button";

export const NotFoundScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl">Por favor, verifique se o endereço está correto e tente novamente.</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-8 bg-white text-primary hover:bg-white/90"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

