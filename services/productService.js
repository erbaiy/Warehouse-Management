// services/productService.js

const BASE_URL = 'http://localhost:3000/products';

export const productService = {
  // Fetch a single product by barcode
  async getProductByBarcode(barcode) {
    try {
      const response = await fetch(`${BASE_URL}/products/barcode/${barcode}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  },

  // Fetch all products
  async getAllProducts() {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  // Add a new product
  async addProduct(productData) {
    try {
      const response = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to add product');
    }
  },

  // Update product stock
  async updateStock(productId, quantity) {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: quantity })
      });
      if (!response.ok) {
        throw new Error('Failed to update stock');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to update stock');
    }
  },

  // Update product details
  async updateProduct(productId, productData) {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to update product');
    }
  },

  // Delete a product
  async deleteProduct(productId) {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  },

  // Search products
  async searchProducts(query) {
    try {
      const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to search products');
    }
  },

  // Get product stock history
  async getStockHistory(productId) {
    try {
      const response = await fetch(`${BASE_URL}/products/${productId}/stock-history`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock history');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch stock history');
    }
  },

  // Check if product exists
  async checkProductExists(barcode) {
    try {
      const response = await fetch(`${BASE_URL}/products/exists/${barcode}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};

// Usage example in your scanner component:
/*
import { productService } from '../services/productService';

const handleBarCodeScanned = async ({ type, data }) => {
  setScanned(true);
  try {
    const productInfo = await productService.getProductByBarcode(data);
    Alert.alert(
      'Product Information',
      `Name: ${productInfo.name}\n` +
      `Price: $${productInfo.price}\n` +
      `Stock: ${productInfo.stock || 0} units\n` +
      `Category: ${productInfo.category || 'N/A'}`
    );
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
*/
