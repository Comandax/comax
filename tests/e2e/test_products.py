import pytest
from playwright.sync_api import Page
from pages.products_page import ProductsPage

@pytest.fixture
def products_page(page: Page):
    return ProductsPage(page)

def test_navigate_to_products_page(products_page: ProductsPage):
    """Test navigation to products page"""
    products_page.navigate_to_products()
    assert page.url == products_page.url

def test_product_name_is_visible(products_page: ProductsPage):
    """Test if product name is visible"""
    products_page.navigate_to_products()
    product_id = "1"  # ajuste conforme seus dados
    product_name = products_page.get_product_name(product_id)
    assert product_name != ""

def test_add_product_to_cart(products_page: ProductsPage):
    """Test adding product to cart"""
    products_page.navigate_to_products()
    product_id = "1"  # ajuste conforme seus dados
    products_page.add_product_to_cart(product_id)
    # Adicione aqui a verificação do carrinho conforme sua implementação
