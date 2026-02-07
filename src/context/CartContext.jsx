import React, { createContext, useContext, useState } from 'react';
import useToast from '../hooks/useToast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showSuccess, showInfo } = useToast();

  const addItem = (item) => {
    const existing = cartItems.find((i) => i.id === item.id);
    
    if (existing) {
      showInfo('Item already added to cart');
      return;
    }
    
    setCartItems((prev) => [...prev, { ...item, quantity: 1, selected: true, size: item.size || 'L' }]);
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

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItem, updateQuantity, updateItemSize, toggleSelection, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
