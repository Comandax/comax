
import pytest
from playwright.sync_api import expect
from pages.products_page import ProductsPage
from pages.login_page import LoginPage

def test_empty_products_state(page):
    """Test empty products state"""
    products_page = ProductsPage(page)
    products_page.navigate_to_products()
    
    # Verificar estado vazio
    expect(page.get_by_text("Nenhum produto cadastrado")).to_be_visible()
    expect(page.get_by_role("button", name="Novo Produto")).to_be_visible()
    expect(page.get_by_role("button", name="Novo Produto")).to_have_class("text-onPrimary")

def test_add_new_product(page):
    """Test adding a new product"""
    products_page = ProductsPage(page)
    products_page.navigate_to_products()
    
    # Adicionar novo produto
    products_page.click_new_product()
    products_page.fill_product_form({
        "reference": "REF001",
        "name": "Produto Teste",
        "sizes": [{"size": "P", "value": 100}],
        "quantities": [{"value": 5}]
    })
    products_page.submit_product_form()
    
    # Verificar se produto foi adicionado
    expect(page.get_by_text("Produto cadastrado com sucesso")).to_be_visible()
    expect(page.get_by_text("REF001")).to_be_visible()

def test_edit_product(page):
    """Test editing a product"""
    products_page = ProductsPage(page)
    products_page.navigate_to_products()
    
    # Editar produto
    products_page.edit_product("REF001")
    products_page.fill_product_form({
        "name": "Produto Editado"
    })
    products_page.submit_product_form()
    
    # Verificar se produto foi editado
    expect(page.get_by_text("Produto atualizado com sucesso")).to_be_visible()
    expect(page.get_by_text("Produto Editado")).to_be_visible()

def test_toggle_product_status(page):
    """Test toggling product status"""
    products_page = ProductsPage(page)
    products_page.navigate_to_products()
    
    # Desativar produto
    products_page.toggle_product_status("REF001")
    
    # Verificar se status foi alterado
    expect(page.get_by_text("Produto desativado com sucesso")).to_be_visible()

def test_delete_product(page):
    """Test deleting a product"""
    products_page = ProductsPage(page)
    products_page.navigate_to_products()
    
    # Deletar produto
    products_page.delete_product("REF001")
    
    # Confirmar exclusão
    page.get_by_role("button", name="Confirmar").click()
    
    # Verificar se produto foi removido
    expect(page.get_by_text("Produto excluído com sucesso")).to_be_visible()
    expect(page.get_by_text("REF001")).not_to_be_visible()
