
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative">
      <button
        onClick={() => navigate("/admin")}
        className="absolute right-4 top-4 p-2 text-foreground hover:text-foreground/80 transition-colors"
        title="Painel Administrativo"
      >
        <Settings2 size={24} />
      </button>
      
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-foreground/80 text-lg mb-8">Por favor, verifique se o endereço está correto.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary text-onPrimary hover:bg-primary/90"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
