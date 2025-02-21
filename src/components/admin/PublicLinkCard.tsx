
import { Share2, ExternalLink, Copy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PublicLinkCardProps {
  companyShortName: string;
  onEdit: () => void;
}

export const PublicLinkCard = ({ companyShortName, onEdit }: PublicLinkCardProps) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${companyShortName}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para sua área de transferência."
    });
  };

  const handleOpenLink = () => {
    const link = `${window.location.origin}/${companyShortName}`;
    window.open(link, '_blank');
  };

  return (
    <Card className="bg-surface border-2 border-surfaceVariant shadow-lg">
      <CardContent className="p-6 space-y-6 relative">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-secondary to-primary rounded-full" />
          <h2 className="text-2xl font-bold text-onSecondaryContainer">
            Link para Pedidos
          </h2>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Share2 className="w-5 h-5 text-secondary" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Link público para seus clientes fazerem pedidos
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {`${window.location.origin}/${companyShortName}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="flex-1 min-w-[120px] bg-white dark:bg-gray-900"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[120px] bg-white dark:bg-gray-900"
                onClick={handleOpenLink}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
              <Button
                variant="outline"
                className="flex-1 min-w-[120px] bg-white dark:bg-gray-900"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
