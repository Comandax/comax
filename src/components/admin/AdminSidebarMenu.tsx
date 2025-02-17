
import { Package, LogOut, User, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { UserEditModal } from "@/components/users/UserEditModal";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminSidebarMenuProps {
  userId: string;
  onLogout: () => void;
}

export const AdminSidebarMenu = ({ userId, onLogout }: AdminSidebarMenuProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link 
            to="/products" 
            className="flex items-center space-x-2 px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
          >
            <Package className="w-5 h-5 text-primary" />
            <span className="font-medium">Produtos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link 
            to="/orders" 
            className="flex items-center space-x-2 px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
          >
            <ClipboardList className="w-5 h-5 text-primary" />
            <span className="font-medium">Pedidos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
        >
          <User className="w-5 h-5 text-primary" />
          <span className="font-medium">Meu Perfil</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={onLogout}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <UserEditModal 
        isOpen={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </SidebarMenu>
  );
};
