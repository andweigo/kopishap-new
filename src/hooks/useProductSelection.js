/**
 * useProductSelection Hook
 * Manages product selection state (quantity, size) with refs for price calculations
 * Follows OOP principles by encapsulating selection logic in a reusable hook
 */
import { useCallback, useRef, useState } from 'react';
import { PRICING, PRODUCT_SIZES } from '../constants';

const SIZES = [PRODUCT_SIZES.S, PRODUCT_SIZES.M, PRODUCT_SIZES.L, PRODUCT_SIZES.XL];
const DEFAULT_SIZE = PRODUCT_SIZES.L;
const DEFAULT_QUANTITY = PRICING.DEFAULT_QUANTITY;
const MAX_QUANTITY = PRICING.MAX_QUANTITY;

export default function useProductSelection(initialSize = DEFAULT_SIZE, initialQuantity = DEFAULT_QUANTITY) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  
  // Use refs to keep values synchronized for callbacks
  const quantityRef = useRef(quantity);
  const sizeRef = useRef(selectedSize);

  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => {
      const newQty = Math.min(prev + 1, MAX_QUANTITY);
      quantityRef.current = newQty;
      return newQty;
    });
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => {
      const newQty = Math.max(prev - 1, 1);
      quantityRef.current = newQty;
      return newQty;
    });
  }, []);

  const selectSize = useCallback((size) => {
    setSelectedSize(size);
    sizeRef.current = size;
  }, []);

  const resetSelection = useCallback(() => {
    setQuantity(DEFAULT_QUANTITY);
    setSelectedSize(DEFAULT_SIZE);
    quantityRef.current = DEFAULT_QUANTITY;
    sizeRef.current = DEFAULT_SIZE;
  }, []);

  const getPrice = useCallback((product) => {
    if (!product) return 0;
    const hasSizes = typeof product.price === 'object';
    return hasSizes ? product.price[sizeRef.current] ?? 0 : product.price;
  }, []);

  const getTotalPrice = useCallback((product) => {
    const price = getPrice(product);
    return price * quantityRef.current;
  }, [getPrice]);

  return {
    // State
    quantity,
    selectedSize,
    // Refs (for synchronized access in callbacks)
    quantityRef,
    sizeRef,
    // Constants
    SIZES,
    // Actions
    incrementQuantity,
    decrementQuantity,
    selectSize,
    resetSelection,
    // Utilities
    getPrice,
    getTotalPrice,
    isMaxQuantity: quantity >= MAX_QUANTITY,
    isMinQuantity: quantity <= 1,
  };
}
