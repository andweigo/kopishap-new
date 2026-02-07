/**
 * useFavoriteButton Hook
 * Manages favorite button state and toggle functionality
 * Follows OOP principles by encapsulating favorite logic in a reusable hook
 */
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';
import useToast from './useToast';

export default function useFavoriteButton(item, options = {}) {
  const { onFavoriteChange, onBeforeRemove } = options;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showInfo, showError } = useToast();

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const checkFavoriteStatus = async () => {
        try {
          // We don't set loading=true here to avoid flickering on re-focus
          const user = await UserService.getCurrentUser();
          if (!user || !mounted) return;

          const isFav = await OrderService.isFavorite(user.id, item.id);
          if (mounted) {
            setIsFavorite(Boolean(isFav));
          }
        } catch (err) {
          if (mounted) setIsFavorite(false);
        } finally {
          if (mounted) setLoading(false);
        }
      };

      checkFavoriteStatus();

      return () => {
        mounted = false;
      };
    }, [item.id])
  );

  const addToFavorites = useCallback(async () => {
    try {
      const user = await UserService.getCurrentUser();
      if (!user) {
        showInfo('Please login to add favorites');
        return { success: false, message: 'Not logged in' };
      }

      const result = await OrderService.addToFavorites(user.id, item);
      if (result.success) {
        setIsFavorite(true);
        showSuccess('Added to favorites');
        if (typeof onFavoriteChange === 'function') {
          onFavoriteChange(true);
        }
      } else {
        showError(result.message || 'Could not add favorite');
      }
      return result;
    } catch (err) {
      showError('Could not add favorite');
      return { success: false, message: err.message };
    }
  }, [item, onFavoriteChange, showSuccess, showError, showInfo]);

  const removeFromFavorites = useCallback(async () => {
    try {
      const user = await UserService.getCurrentUser();
      if (!user) {
        showInfo('Please login to manage favorites');
        return { success: false, message: 'Not logged in' };
      }

      const result = await OrderService.removeFromFavorites(user.id, item.id);
      if (result.success) {
        setIsFavorite(false);
        showSuccess('Removed from favorites');
        if (typeof onFavoriteChange === 'function') {
          onFavoriteChange(false);
        }
      } else {
        showError(result.message || 'Could not remove favorite');
      }
      return result;
    } catch (err) {
      showError('Could not remove favorite');
      return { success: false, message: err.message };
    }
  }, [item.id, onFavoriteChange, showSuccess, showError, showInfo]);

  const toggleFavorite = useCallback(async () => {
    if (isFavorite) {
      if (typeof onBeforeRemove === 'function') {
        onBeforeRemove(item.id, item.name);
      } else {
        return await removeFromFavorites();
      }
    } else {
      return await addToFavorites();
    }
    return { success: true };
  }, [isFavorite, item.id, item.name, onBeforeRemove, addToFavorites, removeFromFavorites]);

  return {
    isFavorite,
    loading,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    refreshStatus: () => {
      setLoading(true);
      checkFavoriteStatus();
    },
  };
}
