
import { StatsCards } from "./StatsCards";
import { RecentOrdersCard } from "../RecentOrdersCard";
import { PublicLinkCard } from "../PublicLinkCard";
import { DisplayModeCard } from "../DisplayModeCard";
import { NoCompanyRegisteredCard } from "../NoCompanyRegisteredCard";
import type { Company } from "@/types/company";
import type { Order } from "@/types/order";

interface DashboardContentProps {
  company: Company | null;
  productsCount: number;
  recentOrders: Order[];
  isLoadingOrders: boolean;
  onEditLink: () => void;
  onRegisterCompany: () => void;
  onDisplayModeSuccess: () => void;
}

export function DashboardContent({
  company,
  productsCount,
  recentOrders,
  isLoadingOrders,
  onEditLink,
  onRegisterCompany,
  onDisplayModeSuccess,
}: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-full">
        <StatsCards 
          productsCount={productsCount} 
          ordersCount={recentOrders.length} 
        />
        <RecentOrdersCard
          orders={recentOrders}
          isLoading={isLoadingOrders}
        />
      </div>
      
      {company ? (
        <div className="grid grid-rows-2 gap-6 h-full">
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
      ) : (
        <div className="h-full">
          <NoCompanyRegisteredCard onRegisterClick={onRegisterCompany} />
        </div>
      )}
    </div>
  );
}
