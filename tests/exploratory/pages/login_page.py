from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from .base_page import BasePage

class LoginPage(BasePage):
    # Locators
    LOGIN_FORM = {
        'email': (By.CSS_SELECTOR, "input[type='email']"),
        'password': (By.CSS_SELECTOR, "input[type='password']"),
        'submit': (By.CSS_SELECTOR, "button[type='submit']")
    }
    
    # Success indicators
    ADMIN_PANEL = (By.CSS_SELECTOR, "[data-testid='admin-panel']")  # You might need to add this data-testid to your admin page
    USERS_PAGE = (By.CSS_SELECTOR, "[data-testid='users-page']")    # You might need to add this data-testid to your users page
    TOAST_MESSAGE = (By.CSS_SELECTOR, "[role='status']")

    def login(self, email, password):
        """Login with the given credentials"""
        self.input_text(*self.LOGIN_FORM['email'], email)
        self.input_text(*self.LOGIN_FORM['password'], password)
        self.click_element(*self.LOGIN_FORM['submit'])

    def is_admin_panel_visible(self):
        """Check if admin panel is visible"""
        try:
            # First wait for navigation to complete by checking URL
            self.wait.until(EC.url_contains("/admin"))
            return True
        except:
            return False

    def is_users_page_visible(self):
        """Check if users page is visible"""
        try:
            # First wait for navigation to complete by checking URL
            self.wait.until(EC.url_contains("/users"))
            return True
        except:
            return False

    def get_toast_message(self):
        """Get the toast message text"""
        try:
            # The toast title contains the success message
            toast_title = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "[role='dialog'] [role='heading']")))
            return toast_title.text.lower()
        except:
            return ""
