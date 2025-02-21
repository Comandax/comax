
import { Package, LogOut, User, ClipboardList, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { UserEditModal } from "@/components/users/UserEditModal";
import { CompanyDetails } from "@/components/companies/CompanyDetails";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { UserProfileModal } from "@/components/users/UserProfileModal";
import { Profile } from "@/types/profile";

interface AdminSidebarMenuProps {
  userId: string;
  onLogout: () => void;
}

export const AdminSidebarMenu = ({ userId, onLogout }: AdminSidebarMenuProps) => {
  const [isProfileViewModalOpen, setIsProfileViewModalOpen] = useState(false);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: company, refetch } = useQuery({
    queryKey: ['company', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching company:', error);
        throw error;
      }
      return data as Company;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      return data as Profile;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <SidebarMenu>
      {company && (
        <div className="px-3 py-2 mb-4">
          <span className="text-lg font-medium text-onSurfaceVariant">{company.name}</span>
        </div>
      )}
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link 
            to="/products" 
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
          >
            <Package className="w-5 h-5 text-onSurfaceVariant" />
            <span className="font-medium text-onSurfaceVariant">Produtos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link 
            to="/orders" 
            className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
          >
            <ClipboardList className="w-5 h-5 text-onSurfaceVariant" />
            <span className="font-medium text-onSurfaceVariant">Pedidos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => setIsCompanyModalOpen(true)}
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
        >
          <Building2 className="w-5 h-5 text-onSurfaceVariant" />
          <span className="font-medium text-onSurfaceVariant">Minha Empresa</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={() => setIsProfileViewModalOpen(true)}
          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-primary/10 transition-colors w-full"
        >
          <User className="w-5 h-5 text-onSurfaceVariant" />
          <span className="font-medium text-onSurfaceVariant">Meu Perfil</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton 
          onClick={onLogout}
          className="flex items-center space-x-2 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <UserProfileModal 
        isOpen={isProfileViewModalOpen}
        onOpenChange={setIsProfileViewModalOpen}
        profile={profile || null}
        onEditClick={() => setIsProfileEditModalOpen(true)}
      />

      <UserEditModal 
        isOpen={isProfileEditModalOpen}
        onOpenChange={setIsProfileEditModalOpen}
      />

      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-3xl">
          {company && (
            <CompanyDetails 
              company={company}
              onUpdateSuccess={() => {
                refetch();
                setIsCompanyModalOpen(false);
              }}
              onClose={() => setIsCompanyModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
};
