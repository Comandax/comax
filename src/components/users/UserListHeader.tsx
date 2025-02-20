
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function UserListHeader() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="h-8 w-1 bg-primary rounded-full" />
        <h2 className="text-2xl font-bold text-primary">Usuários</h2>
      </div>
      {user?.roles?.includes('superuser') && (
        <Button onClick={() => navigate('/users/create')} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="size-4 mr-2" />
          Novo Usuário
        </Button>
      )}
    </div>
  );
}
