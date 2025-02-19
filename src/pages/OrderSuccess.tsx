
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { shortName } = useParams<{ shortName?: string }>();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 space-y-6 bg-surface">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primaryContainer p-3 rounded-full">
              <Check className="w-12 h-12 text-onPrimaryContainer" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-onSurface">Pedido Realizado com Sucesso!</h1>
          <p className="text-onSurfaceVariant">
            Seu pedido foi registrado e em breve entraremos em contato.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate(`/${shortName}`)}
            className="bg-primary text-onPrimary hover:bg-primary/90"
          >
            Fazer Novo Pedido
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
