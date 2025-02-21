
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NoCompanyRegisteredCardProps {
  onRegisterClick: () => void;
}

export function NoCompanyRegisteredCard({ onRegisterClick }: NoCompanyRegisteredCardProps) {
  return (
    <Card className="bg-surface border-2 border-surfaceVariant h-full">
      <CardContent className="p-6 flex flex-col h-full justify-center items-center text-center space-y-4">
        <Building2 className="w-12 h-12 text-primary" />
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-onSurfaceVariant">
            Cadastre sua Empresa
          </h2>
          <p className="text-sm text-onSurfaceVariant/60 max-w-[300px]">
            Para começar a receber pedidos, cadastre as informações da sua empresa
          </p>
        </div>
        <Button
          onClick={onRegisterClick}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Empresa
        </Button>
      </CardContent>
    </Card>
  );
}
