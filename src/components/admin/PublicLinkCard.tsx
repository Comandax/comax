import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";
import { useState } from "react";

interface PublicLinkCardProps {
  companyShortName: string;
  onEdit: () => void;
}

export function PublicLinkCard({ companyShortName, onEdit }: PublicLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const publicLink = `${window.location.origin}/${companyShortName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-surface border-2 border-surfaceVariant shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Link para Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Input
            id="link"
            value={publicLink}
            readOnly
          />
        </div>
        <div className="flex justify-between items-center">
          <Button size="sm" onClick={handleCopy} disabled={copied}>
            {copied ? "Copiado!" : "Copiar Link"}
          </Button>
          <Button size="sm" variant="secondary" onClick={onEdit}>
            Editar Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
