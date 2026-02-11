import { storage } from '../components/storage';

const CART_STORAGE_KEY = '@Kopishapp:cartItems';

/**
 * CartService
 * Encapsulates all business logic related to the shopping cart,
 * particularly its interaction with persistent storage.
 */
class CartService {
  /**
   * Clears the user's shopping cart from persistent storage.
   * This is a critical step during the logout process to prevent data leakage between sessions.
   */
  static async clearCart() {
    try {
      await storage.removeItem(CART_STORAGE_KEY);
      console.log('CartService: Cart cleared successfully from storage.');
    } catch (error) {
      console.error('CartService: Failed to clear cart from storage.', error);
    }
  }
}

export default CartService;