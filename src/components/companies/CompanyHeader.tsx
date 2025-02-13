
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  if (isPublicView) return null;

  return (
    <Card 
      className="p-6 mb-8 bg-white/90 hover:bg-white/95 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/admin")}
        >
          {logo_url && (
            <img 
              src={logo_url} 
              alt={`${name} logo`}
              className="w-16 h-16 object-contain rounded-lg"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          </div>
        </div>
        <Button onClick={onNewProduct}>
          <Plus className="mr-2" />
          Novo Produto
        </Button>
      </div>
    </Card>
  );
};

