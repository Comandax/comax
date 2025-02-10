
import React from "react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
      <div className="text-white text-xl">Carregando produtos...</div>
    </div>
  );
};

