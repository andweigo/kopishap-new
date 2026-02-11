import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storage } from '../components/storage';
import useToast from '../hooks/useToast';

export const CART_STORAGE_KEY_PREFIX = '@Kopishapp:cartItems';
const OLD_CART_KEY = '@Kopishapp:cartItems'; // Kept for one-time migration

const CartContext = createContext(null);

export const getUserCartKey = (userId) => {
  if (!userId) return `${CART_STORAGE_KEY_PREFIX}:anonymous`;
  return `${CART_STORAGE_KEY_PREFIX}:${userId}`;
};

export const CartProvider = ({ children, currentUserId = null }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showSuccess, showInfo } = useToast();

  // One-time migration to clear the old, non-user-specific cart key.
  useEffect(() => {
    const clearOldCartData = async () => {
      await storage.removeItem(OLD_CART_KEY);
      console.log('CartContext: Ran one-time old cart data cleanup.');
    };
    clearOldCartData();
  }, []);

  // Load cart from storage when the user context changes (e.g., login/logout).
  useEffect(() => {
    const loadCart = async () => {
      setIsLoaded(false); // Set loading state
      try {
        const cartKey = getUserCartKey(currentUserId);
        const storedItems = await storage.getItem(cartKey);
        if (storedItems) {
          setCartItems(storedItems);
          console.log('CartContext: Loaded cart for user', currentUserId || 'anonymous');
        } else {
          setCartItems([]); // Ensure cart is empty if nothing is in storage
          console.log('CartContext: No cart found for user', currentUserId || 'anonymous');
        }
      } catch (e) {
        console.error('CartContext: Error loading cart:', e);
        setCartItems([]); // Reset on error
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, [currentUserId]);

  // Save cart to storage whenever it changes. This is the single source of truth for persistence.
  useEffect(() => {
    if (!isLoaded) return;

    const cartKey = getUserCartKey(currentUserId);
    if (cartItems.length > 0) {
      storage.setItem(cartKey, cartItems);
    } else {
      // If cart is empty, remove it from storage to keep it clean.
      storage.removeItem(cartKey);
    }
  }, [cartItems, isLoaded, currentUserId]);

  const addItem = (item) => {
    // Normalize the size to ensure consistent comparison
    const normalizedSize = item.size || 'L';
    // Check for existing item with the same ID and size
    const existing = cartItems.find((i) => i.id === item.id && i.size === normalizedSize);
    if (existing) {
      showInfo('Item is already in the cart.');
      return;
    }
    setCartItems((prev) => [...prev, { ...item, quantity: 1, selected: true, size: normalizedSize }]);
    showSuccess('Item added to cart');
  };

  const updateQuantity = (id, increment) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + increment) } : item)));
  };

  const updateItemSize = (id, size) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, size } : item)));
  };

  const toggleSelection = (id) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Clears the in-memory cart. The `useEffect` hook will then automatically
   * handle removing the cart from persistent storage. This is called on logout.
   */
  const clearCartState = useCallback(() => {
    setCartItems([]);
    console.log('CartContext: In-memory cart state cleared.');
  }, []);

  /**
   * Force reloads the cart from storage for the current user.
   */
  const forceReloadCart = useCallback(async () => {
    try {
      const cartKey = getUserCartKey(currentUserId);
      const storedItems = await storage.getItem(cartKey);
      setCartItems(storedItems || []);
      console.log('CartContext: Force reloaded cart for user:', currentUserId || 'anonymous');
    } catch (e) {
      console.error('CartContext: Error reloading cart:', e);
    }
  }, [currentUserId]);

  const value = {
    cartItems,
    addItem,
    updateQuantity,
    updateItemSize,
    toggleSelection,
    removeItem,
    clearCartState,
    forceReloadCart,
    showSuccess,
    showInfo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
