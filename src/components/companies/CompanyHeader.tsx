
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CompanyHeaderProps {
  logo_url?: string | null;
  name: string;
  isPublicView: boolean;
  onNewProduct?: () => void;
}

export const CompanyHeader = ({ 
  logo_url, 
  name, 
  isPublicView,
  onNewProduct
}: CompanyHeaderProps) => {
  if (isPublicView) return null;

  return (
    <div className="bg-white/5 border-b border-white/10 -mx-4 mb-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4 py-2">
          {logo_url && (
            <img 
              src={logo_url} 
              alt={`${name} logo`}
              className="w-8 h-8 object-contain rounded"
            />
          )}
          <h2 className="text-sm font-medium text-white/90">{name}</h2>
        </div>
        <Button onClick={onNewProduct}>
          <Plus className="mr-2" />
          Novo Produto
        </Button>
      </div>
    </div>
  );
};
