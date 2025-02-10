
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId?: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido Realizado com Sucesso!</h1>
          <p className="text-gray-600">
            Seu pedido foi registrado e em breve entraremos em contato.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => navigate(`/${companyId}`)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Fazer Novo Pedido
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccess;
