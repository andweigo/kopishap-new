import { createContext, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastNotification from '../components/ui/ToastNotification';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const insets = useSafeAreaInsets();

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={[styles.toastContainer, { top: insets.top + 10 }]} pointerEvents="box-none">
        {toasts.map((toast, index) => (
          <ToastNotification key={toast.id} {...toast} index={index} onHide={hideToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: { position: 'absolute', left: 0, right: 0, zIndex: 9999, alignItems: 'center' },
});