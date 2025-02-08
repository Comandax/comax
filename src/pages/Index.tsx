
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductCard } from "@/components/ProductCard";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

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
}

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://82.180.136.47:30000/products');
  const data = await response.json();
  return data.map((product: any) => ({
    _id: product._id,
    reference: product.reference,
    name: product.name,
    sizes: product.sizes.map((size: any) => ({
      label: size.size,
      price: size.value,
      quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120], // Mantendo as mesmas quantidades disponíveis
    })),
    disabled: product.disabled
  }));
};

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar produtos. Por favor, tente novamente mais tarde.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-secondary p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
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
          {products.filter(product => !product.disabled).map((product) => (
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
