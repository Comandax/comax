from .base_page import BasePage

class ProductsPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.url = "http://localhost:8000/products"  # ajuste conforme sua URL
        
    def navigate_to_products(self):
        """Navigate to products page"""
        self.navigate(self.url)
        
    def get_product_name(self, product_id: str) -> str:
        """Get product name by product ID"""
        return self.get_text(f"[data-testid='product-name-{product_id}']")
        
    def add_product_to_cart(self, product_id: str):
        """Add a product to cart"""
        self.click(f"[data-testid='add-to-cart-{product_id}']")
