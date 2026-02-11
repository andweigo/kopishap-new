import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * OrderService - Handles order data persistence with AsyncStorage
 * OOP approach with encapsulated business logic for order management
 */
class OrderService {
  constructor() {
    this.ORDERS_STORAGE_KEY = STORAGE_KEYS.ORDERS;
    this.FAVORITES_STORAGE_KEY = STORAGE_KEYS.FAVORITES;
  }

  /**
   * Save a new order
   * @param {Object} orderData - { userId, items, total, deliveryAddress, status }
   * @returns {Promise<Object>} - { success: boolean, message: string, order: Object }
   */
  async saveOrder(orderData) {
    try {
      const { userId, items, total, subtotal = 0, shipping = 0, deliveryAddress, notes = '' } = orderData;

      if (!userId || !items || items.length === 0) {
        return {
          success: false,
          message: 'Invalid order data',
        };
      }

      const newOrder = {
        id: Date.now().toString(),
        userId,
        items,
        total,
        subtotal,
        shipping,
        deliveryAddress,
        deliveryLandmark: orderData.deliveryLandmark || null,
        deliveryMethod: orderData.deliveryMethod || 'pickup',
        contactNumber: orderData.contactNumber || null,
        notes,
        status: orderData.status || (orderData.deliveryMethod === 'delivery' ? 'processing' : 'completed'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const orders = await this.getAllOrders();
      orders.push(newOrder);
      await AsyncStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(orders));

      return {
        success: true,
        message: 'Order saved successfully',
        order: newOrder,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all orders for a specific user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getUserOrders(userId) {
    try {
      const orders = await this.getAllOrders();
      return orders.filter((order) => order.userId === userId);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  /**
   * Get all orders
   * @returns {Promise<Array>}
   */
  async getAllOrders() {
    try {
      const ordersData = await AsyncStorage.getItem(this.ORDERS_STORAGE_KEY);
      return ordersData ? JSON.parse(ordersData) : [];
    } catch (error) {
      console.error('Error getting all orders:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId
   * @returns {Promise<Object|null>}
   */
  async getOrderById(orderId) {
    try {
      const orders = await this.getAllOrders();
      return orders.find((order) => order.id === orderId) || null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  /**
   * Update order status
   * @param {string} orderId
   * @param {string} status - pending, confirmed, preparing, ready, delivered
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(orderId, status) {
    try {
      const orders = await this.getAllOrders();
      const orderIndex = orders.findIndex((order) => order.id === orderId);

      if (orderIndex === -1) {
        return {
          success: false,
          message: 'Order not found',
        };
      }

      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(orders));

      return {
        success: true,
        message: 'Order status updated',
        order: orders[orderIndex],
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete an order
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  async deleteOrder(orderId) {
    try {
      const orders = await this.getAllOrders();
      const filteredOrders = orders.filter((order) => order.id !== orderId);
      await AsyncStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(filteredOrders));

      return {
        success: true,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Save a product to favorites
   * @param {string} userId
   * @param {Object} product
   * @returns {Promise<Object>}
   */
  async addToFavorites(userId, product) {
    try {
      const favorites = await this.getUserFavorites(userId);
      const exists = favorites.some((fav) => fav.id === product.id);

      if (exists) {
        return {
          success: false,
          message: 'Product already in favorites',
        };
      }

      const allFavorites = await this.getAllFavorites();
      const newFavorite = {
        id: `${userId}_${product.id}`,
        userId,
        product,
        addedAt: new Date().toISOString(),
      };

      allFavorites.push(newFavorite);
      await AsyncStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));

      return {
        success: true,
        message: 'Added to favorites',
        favorite: newFavorite,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Remove product from favorites
   * @param {string} userId
   * @param {string} productId
   * @returns {Promise<Object>}
   */
  async removeFromFavorites(userId, productId) {
    try {
      const allFavorites = await this.getAllFavorites();
      const filtered = allFavorites.filter(
        (fav) => !(fav.userId === userId && fav.product.id === productId)
      );
      await AsyncStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(filtered));

      return {
        success: true,
        message: 'Removed from favorites',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get user's favorite products
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getUserFavorites(userId) {
    try {
      const allFavorites = await this.getAllFavorites();
      return allFavorites.filter((fav) => fav.userId === userId);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Get all favorites
   * @returns {Promise<Array>}
   */
  async getAllFavorites() {
    try {
      const favoritesData = await AsyncStorage.getItem(this.FAVORITES_STORAGE_KEY);
      return favoritesData ? JSON.parse(favoritesData) : [];
    } catch (error) {
      console.error('Error getting all favorites:', error);
      return [];
    }
  }

  /**
   * Check if product is favorite
   * @param {string} userId
   * @param {string} productId
   * @returns {Promise<boolean>}
   */
  async isFavorite(userId, productId) {
    try {
      const favorites = await this.getUserFavorites(userId);
      return favorites.some((fav) => fav.product.id === productId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all orders and favorites for a specific user.
   * This is called on logout to clean up user-specific data from the device.
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async clearUserData(userId) {
    if (!userId) return;
    try {
      // Clear user-specific orders
      const allOrders = await this.getAllOrders();
      const otherUserOrders = allOrders.filter((order) => order.userId !== userId);
      await AsyncStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(otherUserOrders));

      // Clear user-specific favorites
      const allFavorites = await this.getAllFavorites();
      const otherUserFavorites = allFavorites.filter((fav) => fav.userId !== userId);
      await AsyncStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(otherUserFavorites));

      console.log(`OrderService: Cleared all orders and favorites for user ${userId}`);
    } catch (error) {
      console.error(`Error clearing user data for ${userId}:`, error);
    }
  }

  /**
   * Clear all order data (for testing/reset)
   * @returns {Promise<void>}
   */
  async clearAllData() {
    try {
      await AsyncStorage.removeItem(this.ORDERS_STORAGE_KEY);
      await AsyncStorage.removeItem(this.FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export default new OrderService();
