
import pytest
from playwright.sync_api import expect
from pages.orders_page import OrdersPage
from pages.login_page import LoginPage

def test_orders_loading_state(page):
    """Test the orders loading state appearance"""
    orders_page = OrdersPage(page)
    orders_page.navigate_to_orders()
    
    # Verificar se o estado de loading é exibido corretamente
    expect(page.locator(".animate-spin")).to_be_visible()
    expect(page.get_by_text("Carregando pedidos...")).to_be_visible()

def test_empty_orders_state(page):
    """Test the empty orders state appearance and functionality"""
    orders_page = OrdersPage(page)
    orders_page.navigate_to_orders()
    
    # Verificar elementos da tela vazia
    expect(page.get_by_text("Nenhum pedido realizado")).to_be_visible()
    expect(page.get_by_text("Compartilhe o link da sua página para começar a receber pedidos.")).to_be_visible()
    
    # Testar botões de compartilhamento
    expect(page.locator("[aria-label='Copiar link']")).to_be_visible()
    expect(page.locator("[aria-label='Abrir link']")).to_be_visible()

def test_orders_list_functionality(page):
    """Test the orders list functionality including sorting and filtering"""
    orders_page = OrdersPage(page)
    orders_page.navigate_to_orders()
    
    # Testar busca
    orders_page.search_order("João")
    expect(page.get_by_text("João")).to_be_visible()
    
    # Testar ordenação
    orders_page.sort_by_customer_name()
    # Verificar se a ordem está correta
    
    # Testar paginação
    orders_page.go_to_next_page()
    expect(page.get_by_role("button", name="2")).to_have_class("active")

def test_order_details(page):
    """Test viewing order details"""
    orders_page = OrdersPage(page)
    orders_page.navigate_to_orders()
    
    # Abrir detalhes do pedido
    orders_page.open_order_details("primeiro-pedido")
    expect(page.get_by_text("Detalhes do Pedido")).to_be_visible()
    
    # Verificar informações do pedido
    expect(page.get_by_text("Informações do Cliente")).to_be_visible()
    expect(page.get_by_text("Itens do Pedido")).to_be_visible()

def test_order_filters(page):
    """Test order filtering functionality"""
    orders_page = OrdersPage(page)
    orders_page.navigate_to_orders()
    
    # Testar seleção de itens por página
    orders_page.select_items_per_page("20")
    expect(page.locator("table tbody tr")).to_have_count(20)
