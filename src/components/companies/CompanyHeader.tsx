
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface CompanyHeaderProps {
  logo_url?: string | null;
  name: string;
  isPublicView: boolean;
}

export const CompanyHeader = ({ logo_url, name, isPublicView }: CompanyHeaderProps) => {
  const navigate = useNavigate();

  if (isPublicView) return null;

  return (
    <Card 
      className="p-6 mb-8 bg-white/90 cursor-pointer hover:bg-white/95 transition-colors"
      onClick={() => navigate("/admin")}
    >
      <div className="flex items-center gap-4">
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
    </Card>
  );
};
