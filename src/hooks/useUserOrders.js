import { useCallback, useState } from 'react';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';

export default function useUserOrders() {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserOrders = useCallback(async () => {
    try {
      setLoading(true);
      const user = await UserService.getCurrentUser();
      if (!user) {
        setUserOrders([]);
        return;
      }
      const orders = await OrderService.getUserOrders(user.id);
      setUserOrders(orders || []);
    } catch (e) {
      console.error('useUserOrders load error', e);
      setUserOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { userOrders, loading, loadUserOrders };
}
