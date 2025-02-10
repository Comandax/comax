import type { Product } from "@/types/product";

// Mock data moved from Index.tsx
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
      "quantities": [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 120],
      "disabled": true
    }
  ]
};

export const fetchProducts = async (companyId: string = "1"): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = mockData.products
        .filter(product => !companyId || product.companyId === companyId)
        .map(product => ({
          _id: product._id,
          reference: product.reference,
          name: product.name,
          sizes: product.sizes,
          quantities: product.quantities,
          disabled: product.disabled,
          companyId: product.companyId
        }));
      resolve(products);
    }, 500);
  });
};
