
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ReferralInfoProps {
  representativeName: {
    first_name: string;
    last_name: string;
  } | null;
}

export function ReferralInfo({ representativeName }: ReferralInfoProps) {
  if (!representativeName) return null;

  return (
    <Alert className="mb-6" variant="default">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Informação</AlertTitle>
      <AlertDescription>
        Você está se cadastrando através do link de indicação de <strong>{representativeName.first_name} {representativeName.last_name}</strong>. 
        Por esse motivo, você está recebendo <strong>um mês grátis</strong> para utilizar a plataforma e, após esse período, terá <strong>10% de desconto</strong> na mensalidade para sempre!
      </AlertDescription>
    </Alert>
  );
}
