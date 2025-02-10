
import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  error: Error | unknown;
}

export const ErrorScreen = ({ error }: ErrorScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
      <div className="text-white text-xl">
        Erro ao carregar produtos: {error instanceof Error ? error.message : 'Erro desconhecido'}
        <br />
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-white text-primary hover:bg-white/90"
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

