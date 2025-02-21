
from .base_page import BasePage

class OrdersPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.url = "http://localhost:5173/orders"
        
    def navigate_to_orders(self):
        """Navigate to orders page"""
        self.navigate(self.url)
        
    def search_order(self, term: str):
        """Search for an order"""
        self.fill("[placeholder='Buscar por cliente...']", term)
        
    def sort_by_customer_name(self):
        """Sort orders by customer name"""
        self.click("th:has-text('Cliente')")
        
    def sort_by_date(self):
        """Sort orders by date"""
        self.click("th:has-text('Data')")
        
    def sort_by_total(self):
        """Sort orders by total"""
        self.click("th:has-text('Total')")
        
    def go_to_next_page(self):
        """Go to next page"""
        self.click("button:has-text('Próxima')")
        
    def go_to_previous_page(self):
        """Go to previous page"""
        self.click("button:has-text('Anterior')")
        
    def select_items_per_page(self, items: str):
        """Select number of items per page"""
        self.click("[role='combobox']")
        self.click(f"[role='option']:has-text('{items} itens')")
        
    def open_order_details(self, order_id: str):
        """Open order details modal"""
        self.click(f"[data-testid='order-row-{order_id}']")
        
    def expect_loading_state(self):
        """Assert loading state is visible"""
        self.expect_visible(".animate-spin")
        self.expect_text("div", "Carregando pedidos...")
        
    def expect_empty_state(self):
        """Assert empty state is visible"""
        self.expect_text("h2", "Nenhum pedido realizado")
