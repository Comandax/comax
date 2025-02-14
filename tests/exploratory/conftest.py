import pytest
import os
from dotenv import load_dotenv
from utils.driver_factory import DriverFactory
from pages.products_page import ProductsPage

# Load environment variables
load_dotenv()

@pytest.fixture(scope="session")
def base_url():
    """Return the base URL for the application"""
    return os.getenv('BASE_URL', 'http://localhost:5173')

@pytest.fixture
def driver():
    """Create and return a WebDriver instance"""
    driver = DriverFactory.get_driver()
    yield driver
    driver.quit()

@pytest.fixture
def products_page(driver, base_url):
    """Create and return a ProductsPage instance"""
    driver.get(f"{base_url}/products")
    return ProductsPage(driver)
