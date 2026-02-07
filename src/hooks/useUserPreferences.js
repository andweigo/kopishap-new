import { useCallback, useState } from 'react';
import UserService from '../services/UserService';

export default function useUserPreferences() {
  const [userPreferences, setUserPreferences] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await UserService.getCurrentUser();
      setUser(currentUser);
      setUserPreferences(currentUser?.preferences || []);
    } catch (e) {
      console.error('useUserPreferences: error', e);
      setUserPreferences([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { userPreferences, user, loading, loadPreferences };
}
