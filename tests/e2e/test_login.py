
import pytest
from playwright.sync_api import expect
from pages.login_page import LoginPage

def test_successful_login(page):
    """Test successful login flow"""
    login_page = LoginPage(page)
    login_page.navigate_to_login()
    
    # Realizar login
    login_page.fill_email("user@example.com")
    login_page.fill_password("password123")
    login_page.click_login_button()
    
    # Verificar redirecionamento
    expect(page).to_have_url("/admin")
    expect(page.get_by_text("Login realizado com sucesso")).to_be_visible()

def test_invalid_credentials(page):
    """Test login with invalid credentials"""
    login_page = LoginPage(page)
    login_page.navigate_to_login()
    
    # Tentar login com credenciais inválidas
    login_page.fill_email("invalid@example.com")
    login_page.fill_password("wrongpassword")
    login_page.click_login_button()
    
    # Verificar mensagem de erro
    expect(page.get_by_text("Credenciais inválidas")).to_be_visible()

def test_representative_login_redirect(page):
    """Test representative login redirect"""
    login_page = LoginPage(page)
    login_page.navigate_to_login()
    
    # Login como representante
    login_page.fill_email("representative@example.com")
    login_page.fill_password("password123")
    login_page.click_login_button()
    
    # Verificar redirecionamento para listagem de usuários
    expect(page).to_have_url("/users")

def test_empty_fields_validation(page):
    """Test form validation for empty fields"""
    login_page = LoginPage(page)
    login_page.navigate_to_login()
    
    # Tentar login com campos vazios
    login_page.click_login_button()
    
    # Verificar mensagens de validação
    expect(page.locator("[type='email']:invalid")).to_be_visible()
    expect(page.locator("[type='password']:invalid")).to_be_visible()
