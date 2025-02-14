from selenium.webdriver.common.by import By
from .base_page import BasePage

class ProductsPage(BasePage):
    # Locators
    PRODUCT_FORM = {
        'reference': (By.NAME, "reference"),
        'name': (By.NAME, "name"),
        'size': (By.NAME, "sizes.0.size"),
        'value': (By.NAME, "sizes.0.value"),
        'quantity': (By.NAME, "quantities.0.value"),
        'submit': (By.XPATH, "//button[@type='submit']")
    }

    PRODUCT_TABLE = {
        'rows': (By.CSS_SELECTOR, "tbody tr"),
        'edit_button': (By.CSS_SELECTOR, "[aria-label='Edit product']"),
        'delete_button': (By.CSS_SELECTOR, "[aria-label='Delete product']"),
        'confirm_delete': (By.XPATH, "//button[text()='Excluir']")
    }

    SEARCH = (By.PLACEHOLDER, "Buscar produtos...")
    SORT_REFERENCE = (By.XPATH, "//th[contains(text(), 'Referência')]")
    SORT_NAME = (By.XPATH, "//th[contains(text(), 'Nome')]")

    def create_product(self, reference, name, size, value, quantity):
        """Create a new product with the given details"""
        self.input_text(*self.PRODUCT_FORM['reference'], reference)
        self.input_text(*self.PRODUCT_FORM['name'], name)
        self.input_text(*self.PRODUCT_FORM['size'], size)
        self.input_text(*self.PRODUCT_FORM['value'], str(value))
        self.input_text(*self.PRODUCT_FORM['quantity'], str(quantity))
        self.click_element(*self.PRODUCT_FORM['submit'])

    def edit_product(self, row_index, new_name):
        """Edit the product at the given row index"""
        rows = self.find_elements(*self.PRODUCT_TABLE['rows'])
        if row_index < len(rows):
            edit_button = rows[row_index].find_element(*self.PRODUCT_TABLE['edit_button'])
            edit_button.click()
            self.input_text(*self.PRODUCT_FORM['name'], new_name)
            self.click_element(*self.PRODUCT_FORM['submit'])

    def delete_product(self, row_index):
        """Delete the product at the given row index"""
        rows = self.find_elements(*self.PRODUCT_TABLE['rows'])
        if row_index < len(rows):
            delete_button = rows[row_index].find_element(*self.PRODUCT_TABLE['delete_button'])
            delete_button.click()
            self.click_element(*self.PRODUCT_TABLE['confirm_delete'])

    def search_products(self, term):
        """Search for products"""
        self.input_text(*self.SEARCH, term)

    def sort_by_reference(self):
        """Sort products by reference"""
        self.click_element(*self.SORT_REFERENCE)

    def sort_by_name(self):
        """Sort products by name"""
        self.click_element(*self.SORT_NAME)

    def get_product_count(self):
        """Get the total number of products"""
        rows = self.find_elements(*self.PRODUCT_TABLE['rows'])
        return len(rows)

    def get_product_details(self, row_index):
        """Get details of a product at the given row index"""
        rows = self.find_elements(*self.PRODUCT_TABLE['rows'])
        if row_index < len(rows):
            cells = rows[row_index].find_elements(By.TAG_NAME, "td")
            return {
                'reference': cells[0].text,
                'name': cells[1].text,
                'sizes': cells[2].text,
                'quantities': cells[3].text
            }
        return None
