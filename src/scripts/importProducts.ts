
import { createManyProducts } from "@/services/productService";

const productsData = {
  "products": [
    // ... (aqui vão todos os produtos do JSON fornecido)
  ]
};

const COMPANY_ID = "23520efc-9edf-4d19-8006-13d165401577";

async function importProducts() {
  try {
    const products = productsData.products.map(product => ({
      reference: product.reference,
      name: product.name,
      sizes: product.sizes,
      quantities: product.quantities.map(q => ({ value: q })),
    }));

    await createManyProducts(products, COMPANY_ID);
    console.log('Products imported successfully!');
  } catch (error) {
    console.error('Error importing products:', error);
  }
}

importProducts();
