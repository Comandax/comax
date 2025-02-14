
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function NoCompanyState() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 text-center space-y-4 bg-white/95">
          <Building2 className="w-12 h-12 mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Nenhuma empresa cadastrada</h2>
          <p className="text-muted-foreground">
            Para gerenciar produtos, você precisa primeiro cadastrar sua empresa.
          </p>
          <Button 
            onClick={() => navigate('/companies')}
            className="mt-4"
          >
            Cadastrar Empresa
          </Button>
        </Card>
      </div>
    </div>
  );
}
