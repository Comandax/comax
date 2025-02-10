
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductCard } from "@/components/ProductCard";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { NotFoundScreen } from "@/components/layout/NotFoundScreen";
import { ErrorScreen } from "@/components/layout/ErrorScreen";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCompanyBySlug } from "@/services/companyService";
import { getProductsByCompanyId } from "@/services/productService";
import type { ProductSize } from "@/types/product";

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

const fetchProducts = async (companySlug: string) => {
  const company = await getCompanyBySlug(companySlug);
  if (!company) {
    return [];
  }
  return getProductsByCompanyId(company.id);
};

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
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
    return <LoadingScreen />;
  }

  if (!isLoading && products.length === 0) {
    return <NotFoundScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <PageHeader />

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
                sizes: product.sizes.map(size => ({
                  label: size.size,
                  price: size.value,
                  quantities: [0, ...product.quantities]
                }))
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

