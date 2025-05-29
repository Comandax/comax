
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

interface QuantitySelectionModeCardProps {
  companyId: string;
  currentMode: 'radio' | 'select';
  onSuccess: () => void;
}

export function QuantitySelectionModeCard({ companyId, currentMode, onSuccess }: QuantitySelectionModeCardProps) {
  const [mode, setMode] = useState<'radio' | 'select'>(currentMode);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('companies')
        .update({ quantity_selection_mode: mode })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: "Configuração salva com sucesso!",
        description: "O modo de seleção de quantidade foi atualizado.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating quantity selection mode:', error);
      toast({
        title: "Erro ao salvar configuração",
        description: "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-primary/20 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold text-gray-900">
          Modo de Seleção de Quantidade
        </h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Escolha como os clientes vão selecionar as quantidades dos produtos:
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modo de Exibição:
          </label>
          <Select value={mode} onValueChange={(value: 'radio' | 'select') => setMode(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o modo" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="radio">Radio Buttons (Padrão)</SelectItem>
              <SelectItem value="select">Lista Suspensa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Radio Buttons:</strong> Exibe todas as opções de quantidade visíveis de uma vez.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <strong>Lista Suspensa:</strong> Exibe as quantidades em um menu dropdown mais compacto.
          </p>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isLoading || mode === currentMode}
          className="w-full bg-primary text-onPrimary"
        >
          {isLoading ? 'Salvando...' : 'Salvar Configuração'}
        </Button>
      </div>
    </Card>
  );
}
