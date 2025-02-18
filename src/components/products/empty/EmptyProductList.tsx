
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageX, Plus } from "lucide-react";

interface EmptyProductListProps {
  onNewProduct: () => void;
}

export function EmptyProductList({ onNewProduct }: EmptyProductListProps) {
  return (
    <Card className="p-8 text-center space-y-4 bg-white/95">
      <PackageX className="w-12 h-12 mx-auto text-primary" />
      <h2 className="text-2xl font-semibold">Nenhum produto cadastrado</h2>
      <p className="text-muted-foreground">
        Clique no botão "Novo Produto" abaixo para começar a cadastrar seus produtos.
      </p>
      <Button onClick={onNewProduct} className="bg-primary hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        Novo Produto
      </Button>
    </Card>
  );
}
