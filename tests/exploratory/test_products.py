import pytest
import time
from random import randint

@pytest.mark.exploratory
class TestProducts:
    def test_create_product(self, products_page):
        """Test creating a new product"""
        random_num = randint(1000, 9999)
        products_page.create_product(
            reference=f"REF{random_num}",
            name=f"Test Product {random_num}",
            size="M",
            value=100,
            quantity=10
        )
        time.sleep(1)  # Wait for product to be created
        
        # Verify product was created
        products_page.search_products(f"REF{random_num}")
        time.sleep(1)
        assert products_page.get_product_count() > 0
        
        # Take screenshot
        products_page.take_screenshot(f"create_product_{random_num}")

    def test_edit_product(self, products_page):
        """Test editing an existing product"""
        # Create a product first
        random_num = randint(1000, 9999)
        products_page.create_product(
            reference=f"REF{random_num}",
            name=f"Test Product {random_num}",
            size="M",
            value=100,
            quantity=10
        )
        time.sleep(1)

        # Edit the product
        new_name = f"Updated Product {random_num}"
        products_page.edit_product(0, new_name)
        time.sleep(1)

        # Verify product was updated
        product_details = products_page.get_product_details(0)
        assert product_details['name'] == new_name
        
        # Take screenshot
        products_page.take_screenshot(f"edit_product_{random_num}")

    def test_delete_product(self, products_page):
        """Test deleting a product"""
        # Create a product first
        random_num = randint(1000, 9999)
        products_page.create_product(
            reference=f"REF{random_num}",
            name=f"Test Product {random_num}",
            size="M",
            value=100,
            quantity=10
        )
        time.sleep(1)

        # Get initial count
        initial_count = products_page.get_product_count()

        # Delete the product
        products_page.delete_product(0)
        time.sleep(1)

        # Verify product was deleted
        final_count = products_page.get_product_count()
        assert final_count == initial_count - 1
        
        # Take screenshot
        products_page.take_screenshot(f"delete_product_{random_num}")

    def test_search_and_sort(self, products_page):
        """Test search and sort functionality"""
        # Create some test products
        for i in range(3):
            random_num = randint(1000, 9999)
            products_page.create_product(
                reference=f"REF{random_num}",
                name=f"Test Product {random_num}",
                size="M",
                value=100,
                quantity=10
            )
            time.sleep(1)

        # Test search
        products_page.search_products("REF")
        time.sleep(1)
        assert products_page.get_product_count() > 0

        # Test sorting
        products_page.sort_by_name()
        time.sleep(1)
        products_page.sort_by_reference()
        time.sleep(1)
        
        # Take screenshot
        products_page.take_screenshot("search_and_sort")
