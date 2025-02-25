
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground/90 mb-2">
          Painel Administrativo
        </h1>
        <p className="text-lg text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>
      <SidebarTrigger>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Menu className="h-6 w-6 text-foreground/70" />
        </Button>
      </SidebarTrigger>
    </div>
  );
}
