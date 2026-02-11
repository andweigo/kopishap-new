/**
 * useCurrentUser Hook
 * Manages current user state and provides authentication-related utilities
 * Follows OOP principles by encapsulating user session logic
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import FeedbackService from '../services/FeedbackService';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';

const CART_KEY_PREFIX = '@Kopishapp:cartItems';
const OLD_CART_KEY = '@Kopishapp:cartItems';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartContext = useCart();

  const loadCurrentUser = useCallback(async () => {
    try {
      setError(null);
      const currentUser = await UserService.getCurrentUser();
      if (currentUser) {
        const normalizedUser = {
          ...currentUser,
          preferences: currentUser.preferences || [],
        };
        setUser(normalizedUser);
        // Force reload cart for the logged in user
        if (cartContext && cartContext.forceReloadCart) {
          await cartContext.forceReloadCart();
        }
      } else {
        setUser(null);
        // Clear cart when no user is logged in
        if (cartContext && cartContext.clearCartState) {
          await cartContext.clearCartState();
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cartContext]);

  const logout = useCallback(async () => {
    const userIdToLogout = user?.id;
    console.log('useCurrentUser: Logging out user:', userIdToLogout);

    // --- Step 1: Clear in-memory cart state ---
    // This delegates cart clearing to the CartContext. The context's effects
    // will handle clearing the persistent storage for the current user.
    if (cartContext) {
      cartContext.clearCartState();
      console.log('useCurrentUser: Called cartContext.clearCartState()');
    }

    // --- Step 2: Clear other user-related data from services ---
    await UserService.logoutUser();
    await FeedbackService.clearFeedbacks();
    if (userIdToLogout) {
      await OrderService.clearUserData(userIdToLogout);
    }

    // --- Step 3: Clear user from the provider's state, triggering UI update ---
    setUser(null);
    console.log('User logged out successfully.');
  }, [user, cartContext]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const value = {
    user,
    loading,
    error,
    isLoggedIn: user !== null,
    loadCurrentUser,
    logout,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
}
