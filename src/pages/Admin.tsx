
import { LayoutDashboard, Package, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Admin = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Button variant="outline" asChild>
          <Link to="/companies" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Editar Empresa
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/products"
          className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Package className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Produtos</h2>
            <p className="text-gray-600">Gerenciar catálogo de produtos</p>
          </div>
        </Link>

        <Link 
          to="/orders"
          className="flex items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <LayoutDashboard className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Relatório de Pedidos</h2>
            <p className="text-gray-600">Visualizar e gerenciar pedidos</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
