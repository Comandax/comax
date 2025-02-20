from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page):
        self.page = page
        
    def navigate(self, url: str):
        """Navigate to a specific URL"""
        self.page.goto(url)
        
    def get_text(self, selector: str) -> str:
        """Get text content of an element"""
        return self.page.text_content(selector)
        
    def click(self, selector: str):
        """Click on an element"""
        self.page.click(selector)
        
    def fill(self, selector: str, value: str):
        """Fill a form field"""
        self.page.fill(selector, value)
        
    def is_visible(self, selector: str) -> bool:
        """Check if an element is visible"""
        return self.page.is_visible(selector)
        
    def wait_for_selector(self, selector: str, state: str = "visible"):
        """Wait for an element to be present"""
        return self.page.wait_for_selector(selector, state=state)
        
    def get_by_role(self, role: str, name: str = None):
        """Get element by ARIA role"""
        return self.page.get_by_role(role, name=name) if name else self.page.get_by_role(role)
        
    def get_by_test_id(self, test_id: str):
        """Get element by data-testid attribute"""
        return self.page.get_by_test_id(test_id)
        
    def expect_url(self, url: str):
        """Assert current URL"""
        expect(self.page).to_have_url(url)
        
    def expect_visible(self, selector: str):
        """Assert element is visible"""
        expect(self.page.locator(selector)).to_be_visible()
        
    def expect_text(self, selector: str, text: str):
        """Assert element contains text"""
        expect(self.page.locator(selector)).to_contain_text(text)
