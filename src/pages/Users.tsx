
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/80"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para o painel
        </Button>
      </div>
      <UserList />
    </div>
  );
}
