
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductListFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  showOnlyActive: boolean;
  onShowOnlyActiveChange: (value: boolean) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onOpenNewProductModal: () => void;
}

export function ProductListFilters({
  search,
  onSearchChange,
  showOnlyActive,
  onShowOnlyActiveChange,
  itemsPerPage,
  onItemsPerPageChange,
  onOpenNewProductModal,
}: ProductListFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou referência..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <Button onClick={onOpenNewProductModal} className="bg-primary text-onPrimary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Produto
        </Button>

        <div className="flex items-center gap-2">
          <Switch
            checked={showOnlyActive}
            onCheckedChange={onShowOnlyActiveChange}
            id="active-filter"
          />
          <Label htmlFor="active-filter">Mostrar apenas ativos</Label>
        </div>

        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 itens</SelectItem>
            <SelectItem value="10">10 itens</SelectItem>
            <SelectItem value="20">20 itens</SelectItem>
            <SelectItem value="50">50 itens</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
