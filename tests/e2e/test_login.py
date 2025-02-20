import pytest
from playwright.sync_api import Page, expect
from pages.login_page import LoginPage

@pytest.fixture
def login_page(page: Page):
    return LoginPage(page)

def test_navigate_to_login_page(login_page: LoginPage):
    """Test if login page loads correctly"""
    login_page.navigate_to_login()
    expect(login_page.page).to_have_url(login_page.url)
    
def test_login_with_valid_credentials(login_page: LoginPage):
    """Test successful login with valid credentials"""
    login_page.navigate_to_login()
    login_page.login("user@example.com", "password123")
    login_page.expect_login_success()
    
def test_login_with_invalid_credentials(login_page: LoginPage):
    """Test login failure with invalid credentials"""
    login_page.navigate_to_login()
    login_page.login("invalid@example.com", "wrongpassword")
    login_page.expect_login_error("Invalid email or password")
    
def test_login_with_empty_fields(login_page: LoginPage):
    """Test login with empty fields"""
    login_page.navigate_to_login()
    login_page.click_login_button()
    # Verify that both fields show validation errors
    login_page.expect_visible('[data-testid="email-error"]')
    login_page.expect_visible('[data-testid="password-error"]')
    
def test_password_visibility_toggle(login_page: LoginPage):
    """Test password visibility toggle"""
    login_page.navigate_to_login()
    # Find password input and toggle button
    password_input = login_page.page.locator('[data-testid="password-input"]')
    toggle_button = login_page.page.locator('[data-testid="password-toggle"]')
    
    # Initial state should be password
    expect(password_input).to_have_attribute("type", "password")
    
    # Click toggle and check if password is visible
    toggle_button.click()
    expect(password_input).to_have_attribute("type", "text")
    
    # Click toggle again and check if password is hidden
    toggle_button.click()
    expect(password_input).to_have_attribute("type", "password")
