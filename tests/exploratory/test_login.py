import pytest
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from pages.login_page import LoginPage

@pytest.mark.exploratory
class TestLogin:
    def test_admin_login(self, login_page):
        """Test login with admin credentials"""
        login_page.login("teste3@gmail.com", "123456")
        
        # Verify admin panel is displayed
        assert login_page.is_admin_panel_visible(), "Should redirect to admin panel"
        
        # Verify success toast message
        toast_text = login_page.get_toast_message()
        assert "login realizado com sucesso" in toast_text.lower(), "Success toast message should be displayed"
        
        # Take screenshot
        login_page.take_screenshot("admin_login_success")

    def test_user_management_login(self, login_page):
        """Test login with user management credentials"""
        login_page.login("contatocomandax@gmail.com", "contatocomandax")
        
        # Verify users page is displayed
        assert login_page.is_users_page_visible(), "Should redirect to users page"
        
        # Take screenshot
        login_page.take_screenshot("user_management_login_success")
