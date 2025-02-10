
import { useState } from "react";
import { ContactForm, type ContactFormData } from "@/components/ContactForm";
import { ProductCard } from "@/components/ProductCard";
import { FloatingTotal } from "@/components/FloatingTotal";
import { OrderNotes } from "@/components/OrderNotes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";

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

// Mock data now includes companyId
const mockData = {
  "products": [
    {
      "_id": "65c14c53ebe1ad654f459e81",
      "reference": "3001",
      "name": "Calcinha Infantil com botão",
      "sizes": [
        {"size": "P", "value": 5.76},
        {"size": "M", "value": 5.76},
        {"size": "G", "value": 5.76},
        {"size": "GG", "value": 5.76}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false,
      "companyId": "1"
    },
    {
      "_id": "65c14c98ebe1ad654f459e82",
      "reference": "3002",
      "name": "Cueca Feminina Infantil (algodão)",
      "sizes": [
        {"size": "P", "value": 7.54},
        {"size": "M", "value": 7.54},
        {"size": "G", "value": 7.54},
        {"size": "GG", "value": 7.54}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false
    },
    {
      "_id": "65c14cceebe1ad654f459e84",
      "reference": "3003",
      "name": "Calcinha Infantil Acapulco (sainha)",
      "sizes": [
        {"size": "PP", "value": 12.5},
        {"size": "P", "value": 12.5},
        {"size": "M", "value": 12.5},
        {"size": "G", "value": 12.5}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false
    },
    {
      "_id": "65c14d05ebe1ad654f459e85",
      "reference": "3004",
      "name": "Calcinha Infantil Babadinho Perna",
      "sizes": [
        {"size": "PP", "value": 5.96},
        {"size": "P", "value": 5.96},
        {"size": "M", "value": 5.96},
        {"size": "G", "value": 5.96},
        {"size": "GG", "value": 5.96}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false
    },
    {
      "_id": "65c14d42ebe1ad654f459e87",
      "reference": "3005",
      "name": "Calcinha Infantil Cós Personalizado",
      "sizes": [
        {"size": "PP", "value": 5.86},
        {"size": "P", "value": 5.86},
        {"size": "M", "value": 5.86},
        {"size": "G", "value": 5.86},
        {"size": "GG", "value": 5.86}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false
    },
    {
      "_id": "65c14d59ebe1ad654f459e88",
      "reference": "3006",
      "name": "Calcinha Infantil Babadinho no Cós",
      "sizes": [
        {"size": "PP", "value": 5.76},
        {"size": "P", "value": 5.76},
        {"size": "M", "value": 5.76},
        {"size": "G", "value": 5.76},
        {"size": "GG", "value": 5.76}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false
    },
    {
      "_id": "65c14d73ebe1ad654f459e89",
      "reference": "3008",
      "name": "Calcinha Infantil Babadinho nas Costas",
      "sizes": [
        {"size": "P", "value": 6.96},
        {"size": "M", "value": 6.96},
        {"size": "G", "value": 6.96}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": false
    },
    {
      "_id": "65c14db4ebe1ad654f459e8b",
      "reference": "3011",
      "name": "Calcinha Infantil Sophia",
      "sizes": [
        {"size": "P", "value": 7.1},
        {"size": "M", "value": 7.1},
        {"size": "G", "value": 7.1}
      ],
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120],
      "disabled": true
    }
  ]
};

const fetchProducts = async (companyId: string = "1"): Promise<Product[]> => {
  // Simulating an async operation with the mock data and filtering by company
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = mockData.products
        .filter(product => product.companyId === companyId)
        .map(product => ({
          _id: product._id,
          reference: product.reference,
          name: product.name,
          sizes: product.sizes.map(size => ({
            label: size.size,
            price: size.value,
            quantities: [0, ...product.quantities],
          })),
          disabled: product.disabled,
          companyId: product.companyId
        }));
      resolve(filteredProducts);
    }, 500);
  });
};

const Index = () => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const companyId = "1";

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => fetchProducts(companyId),
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
