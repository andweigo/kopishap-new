/**
 * useCurrentUser Hook
 * Manages current user state and provides authentication-related utilities
 * Follows OOP principles by encapsulating user session logic
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import FeedbackService from '../services/FeedbackService';
import UserService from '../services/UserService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCurrentUser = useCallback(async () => {
    try {
      setError(null);
      const currentUser = await UserService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await UserService.logoutUser();
    await FeedbackService.clearFeedbacks();
    setUser(null);
  }, []);

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
