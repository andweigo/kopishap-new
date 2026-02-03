import React, { createContext, useContext, useState } from 'react';
import { Platform, ToastAndroid, Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const addItem = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        showToast('Item already added to cart');
        return prev;
      }
      showToast('Item added to cart');
      return [...prev, { ...item, quantity: 1, selected: true, size: item.size || 'L' }];
    });
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

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItem, updateQuantity, updateItemSize, toggleSelection, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
