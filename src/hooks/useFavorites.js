import { useCallback, useState } from 'react';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await UserService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const userFavorites = await OrderService.getUserFavorites(currentUser.id);
        setFavorites((userFavorites || []).map((fav) => fav.product));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('useFavorites: error loading favorites', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFavorite = useCallback(async (productId) => {
    if (!user) return { success: false, message: 'No user' };
    return OrderService.removeFromFavorites(user.id, productId);
  }, [user]);

  const addFavorite = useCallback(async (product) => {
    if (!user) return { success: false, message: 'No user' };
    return OrderService.addToFavorites(user.id, product);
  }, [user]);

  return {
    favorites,
    loading,
    user,
    loadFavorites,
    removeFavorite,
    addFavorite,
  };
}
