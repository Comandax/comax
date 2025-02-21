
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, ListStart, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Company } from "@/types/company";

interface DisplayModeCardProps {
  companyId: string;
  currentMode: string;
  onSuccess: () => void;
}

export function DisplayModeCard({ companyId, currentMode, onSuccess }: DisplayModeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleModeChange = async (mode: 'full' | 'compact') => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('companies')
        .update({ display_mode: mode })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Modo de exibição atualizado",
        description: `Os produtos serão exibidos no modo ${mode === 'full' ? 'completo' : 'compacto'}.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating display mode:', error);
      toast({
        title: "Erro ao atualizar modo de exibição",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-surface border-2 border-surfaceVariant shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Modo de Exibição de Produtos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Escolha como seus produtos serão exibidos na página de pedidos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => handleModeChange('full')}
            disabled={isLoading || currentMode === 'full'}
            className={`flex-1 gap-2 bg-background ${currentMode === 'full' ? 'bg-primary text-onPrimary hover:bg-primary/90' : 'text-primary'}`}
          >
            <ListStart className="h-4 w-4" />
            Completo
            {currentMode === 'full' && <CheckCircle className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleModeChange('compact')}
            disabled={isLoading || currentMode === 'compact'}
            className={`flex-1 gap-2 bg-background ${currentMode === 'compact' ? 'bg-primary text-onPrimary hover:bg-primary/90' : 'text-primary'}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Compacto
            {currentMode === 'compact' && <CheckCircle className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
