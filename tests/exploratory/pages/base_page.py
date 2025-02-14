from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)

    def find_element(self, by, value):
        """Wait for element to be present and return it"""
        return self.wait.until(EC.presence_of_element_located((by, value)))

    def find_elements(self, by, value):
        """Wait for elements to be present and return them"""
        return self.wait.until(EC.presence_of_all_elements_located((by, value)))

    def click_element(self, by, value):
        """Wait for element to be clickable and click it"""
        element = self.wait.until(EC.element_to_be_clickable((by, value)))
        element.click()

    def input_text(self, by, value, text):
        """Wait for element to be visible and input text"""
        element = self.wait.until(EC.visibility_of_element_located((by, value)))
        element.clear()
        element.send_keys(text)

    def is_element_present(self, by, value, timeout=10):
        """Check if element is present within timeout"""
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return True
        except TimeoutException:
            return False

    def take_screenshot(self, name):
        """Take a screenshot and save it"""
        self.driver.save_screenshot(f"screenshots/{name}.png")
