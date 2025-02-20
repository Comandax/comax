from .base_page import BasePage

class LoginPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.url = "http://localhost:8080/login"
        
    def navigate_to_login(self):
        """Navigate to login page"""
        self.navigate(self.url)
        
    def fill_email(self, email: str):
        """Fill email field"""
        self.fill('[data-testid="email-input"]', email)
        
    def fill_password(self, password: str):
        """Fill password field"""
        self.fill('[data-testid="password-input"]', password)
        
    def click_login_button(self):
        """Click login button"""
        self.click('[data-testid="login-button"]')
        
    def get_error_message(self) -> str:
        """Get error message if present"""
        return self.get_text('[data-testid="error-message"]')
        
    def login(self, email: str, password: str):
        """Complete login flow"""
        self.fill_email(email)
        self.fill_password(password)
        self.click_login_button()
        
    def expect_login_success(self):
        """Assert successful login"""
        # Assuming successful login redirects to dashboard or home
        self.page.wait_for_url("**/dashboard")
        
    def expect_login_error(self, error_message: str):
        """Assert login error"""
        self.expect_visible('[data-testid="error-message"]')
        self.expect_text('[data-testid="error-message"]', error_message)
