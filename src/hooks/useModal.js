import { useCallback, useState } from 'react';

/**
 * useModal Hook
 * Encapsulates modal state management logic.
 * Follows OOP principles by abstracting UI state control.
 */
export default function useModal() {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState(null);

  const show = useCallback((modalTitle = '', modalMessage = '', modalData = null) => {
    setTitle(modalTitle);
    setMessage(modalMessage);
    setData(modalData);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    title,
    message,
    data,
    show,
    hide,
    setVisible, // Expose setter for manual control if needed
  };
}