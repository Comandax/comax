
import { useState, useEffect } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductCard } from "@/components/ProductCard";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  _id: string;
  reference: string;
  name: string;
  sizes: Array<{
    label: string;
    price: number;
    quantities: number[];
  }>;
  disabled: boolean;
  companyId?: string;
}

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

interface ProductSize {
  size: string;
  value: number;
}

const fetchProducts = async (companySlug: string): Promise<Product[]> => {
  // First, get company ID from the slug
  const { data: companies, error: companyError } = await supabase
    .from('companies')
    .select('id, name')
    .eq('active', true)
    .ilike('name', companySlug.replace(/-/g, ' '))
    .maybeSingle();

  if (companyError) {
    throw companyError;
  }

  if (!companies) {
    return []; // Return empty array if company not found
  }

  // Then fetch products for this company
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companies.id)
    .eq('disabled', false);

  if (productsError) {
    throw productsError;
  }

  return (products || []).map(product => ({
    _id: product.id,
    reference: product.reference,
    name: product.name,
    sizes: ((product.sizes || []) as ProductSize[]).map(size => ({
      label: size.size,
      price: size.value,
      quantities: [0, ...(product.quantities || [])],
    })),
    disabled: product.disabled,
    companyId: product.company_id
  }));
};

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get company slug from URL path
  const companySlug = location.pathname.split('/').pop() || '';

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', companySlug],
    queryFn: () => fetchProducts(companySlug),
    enabled: !!companySlug,
  });

  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form data:", data);
  };

  const handleQuantitySelect = (productId: string, size: string, quantity: number, price: number) => {
    setSelectedItems(prev => {
      const filtered = prev.filter(item => !(item.productId === productId && item.size === size));
      
      if (quantity > 0) {
        return [...filtered, { productId, size, quantity, price }];
      }
      
      return filtered;
    });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const handleSubmitOrder = () => {
    toast({
      title: "Pedido enviado com sucesso!",
      description: "Entraremos em contato em breve.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">Carregando produtos...</div>
      </div>
    );
  }

  // Show "page not found" message when no products are found and we're not loading
  if (!isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-xl">Por favor, verifique se o endereço está correto e tente novamente.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-8 bg-white text-primary hover:bg-white/90"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">
          Erro ao carregar produtos: {error instanceof Error ? error.message : 'Erro desconhecido'}
          <br />
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-primary hover:bg-white/90"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center relative">
          <button
            onClick={() => navigate("/admin")}
            className="absolute right-0 top-0 p-2 text-white hover:text-white/80 transition-colors"
            title="Painel Administrativo"
          >
            <Settings2 size={24} />
          </button>
          <img
            src="/lovable-uploads/aa777edd-491a-43ae-aee4-5444b6657060.png"
            alt="Logo"
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-3xl font-bold text-white mt-4">Simulações e Pedidos</h1>
        </div>

        <ContactForm onSubmit={handleContactSubmit} />

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Itens para pedido</h2>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                image: `http://82.180.136.47/pedido/productImages/${product.reference}.jpeg?v=2`,
                ref: product.reference,
                sizes: product.sizes
              }}
              onQuantitySelect={(size, quantity, price) => 
                handleQuantitySelect(product._id, size, quantity, price)
              }
            />
          ))}
        </div>

        <OrderNotes value={notes} onChange={setNotes} />

        <div className="text-center">
          <Button
            onClick={handleSubmitOrder}
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            Enviar pedido
          </Button>
        </div>
      </div>

      <FloatingTotal total={calculateTotal()} />
    </div>
  );
};

export default Index;
