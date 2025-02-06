import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductCard } from "@/components/ProductCard";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Cueca Feminina Infantil (Algodão)",
    image: "/lovable-uploads/1856d481-4fe4-450a-937a-54bdaffb0f22.png",
    ref: "3002",
    sizes: [
      {
        label: "P",
        price: 7.54,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
      {
        label: "M",
        price: 7.54,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
      {
        label: "G",
        price: 7.54,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
      {
        label: "GG",
        price: 7.54,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
    ],
  },
  {
    id: "2",
    name: "Daurinha Sublime",
    image: "/lovable-uploads/8b77818a-8bb0-45ea-9df7-84802eecd322.png",
    ref: "3007",
    sizes: [
      {
        label: "P",
        price: 7.00,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
      {
        label: "M",
        price: 7.00,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
      {
        label: "G",
        price: 7.00,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
      {
        label: "GG",
        price: 7.00,
        quantities: [0, 6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      },
    ],
  },
];

interface SelectedItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
}

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleContactSubmit = (data: ContactFormData) => {
    console.log("Contact form data:", data);
  };

  const handleQuantitySelect = (productId: string, size: string, quantity: number, price: number) => {
    setSelectedItems(prev => {
      // Remove any existing selection for this product size
      const filtered = prev.filter(item => !(item.productId === productId && item.size === size));
      
      // Add new selection if quantity is not 0
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
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuantitySelect={(size, quantity, price) => 
                handleQuantitySelect(product.id, size, quantity, price)
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