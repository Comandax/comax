
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link2, Copy, ExternalLink, Edit } from "lucide-react";
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

  const handleOpen = () => {
    window.open(publicLink, '_blank');
  };

  return (
    <Card className="bg-surface border-2 border-surfaceVariant">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-onSurfaceVariant">
          <Link2 className="h-5 w-5" />
          Link para Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              id="link"
              value={publicLink}
              readOnly
              className="bg-background"
            />
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCopy}
              disabled={copied}
              className="flex flex-col items-center gap-1 h-auto py-1"
            >
              <Copy className="h-5 w-5" />
              <span className="text-xs">{copied ? "Copiado!" : "Copiar"}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleOpen}
              className="flex flex-col items-center gap-1 h-auto py-1"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="text-xs">Abrir</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit}
              className="flex flex-col items-center gap-1 h-auto py-1"
            >
              <Edit className="h-5 w-5" />
              <span className="text-xs">Editar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
