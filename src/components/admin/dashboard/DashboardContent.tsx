
import { NoCompanyRegisteredCard } from "../NoCompanyRegisteredCard";
import { PublicLinkCard } from "../PublicLinkCard";
import { DisplayModeCard } from "../DisplayModeCard";
import { StatsCards } from "./StatsCards";
import { RecentOrdersCard } from "../RecentOrdersCard";
import { QuantitySelectionModeCard } from "../QuantitySelectionModeCard";

interface DashboardContentProps {
  company: any;
  productsCount: number;
  recentOrders: any[];
  isLoadingOrders: boolean;
  onEditLink: () => void;
  onRegisterCompany: () => void;
  onDisplayModeSuccess: () => void;
}

export const DashboardContent = ({ 
  company, 
  productsCount, 
  recentOrders, 
  isLoadingOrders, 
  onEditLink, 
  onRegisterCompany, 
  onDisplayModeSuccess 
}: DashboardContentProps) => {
  if (!company) {
    return (
      <div className="space-y-6">
        <NoCompanyRegisteredCard onRegisterClick={onRegisterCompany} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards 
        productsCount={productsCount} 
        ordersCount={recentOrders.length}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PublicLinkCard 
          companyShortName={company.short_name} 
          onEdit={onEditLink} 
        />
        <DisplayModeCard 
          companyId={company.id}
          currentMode={company.display_mode}
          onSuccess={onDisplayModeSuccess}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuantitySelectionModeCard
          companyId={company.id}
          currentMode={company.quantity_selection_mode || 'radio'}
          onSuccess={onDisplayModeSuccess}
        />
        <RecentOrdersCard 
          orders={recentOrders}
          isLoading={isLoadingOrders}
        />
      </div>
    </div>
  );
};
