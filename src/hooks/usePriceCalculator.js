/**
 * usePriceCalculator Hook
 * Provides utility functions for price calculations
 * Follows OOP principles by encapsulating pricing logic in a reusable hook
 */
import { PRICING } from '../constants';

const DELIVERY_FEE = PRICING.DELIVERY_FEE;
const FREE_DELIVERY_THRESHOLD = PRICING.FREE_DELIVERY_THRESHOLD; // No free delivery threshold currently

/**
 * Gets the effective price for an item considering its size
 * @param {Object} item - Product item with price property
 * @returns {number} - The calculated price
 */
export function getItemPrice(item) {
  if (!item) return 0;
  const { price, size } = item;

  if (typeof price === 'object') {
    const defaultSize = size || 'L';
    return price[defaultSize] ?? Object.values(price)[0] ?? 0;
  }
  return price ?? 0;
}

/**
 * Calculates the total for a single item considering quantity
 * @param {Object} item - Product item
 * @returns {number} - Total price for the item
 */
export function getItemTotal(item) {
  const unitPrice = getItemPrice(item);
  const quantity = item?.quantity || 1;
  return unitPrice * quantity;
}

/**
 * Calculates subtotal for a list of items
 * @param {Array} items - List of product items
 * @returns {number} - Subtotal price
 */
export function calculateSubtotal(items = []) {
  return items.reduce((sum, item) => sum + getItemTotal(item), 0);
}

/**
 * Calculates shipping fee based on delivery method and subtotal
 * @param {string} method - 'pickup' | 'delivery'
 * @param {number} subtotal - Subtotal amount
 * @returns {number} - Shipping fee
 */
export function calculateShipping(method, subtotal = 0) {
  if (method === 'pickup') return 0;
  // Only apply free delivery if threshold is set AND subtotal meets threshold
  if (FREE_DELIVERY_THRESHOLD > 0 && subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
}

/**
 * Calculates grand total including shipping
 * @param {Array} items - List of product items
 * @param {string} method - 'pickup' | 'delivery'
 * @returns {Object} - { subtotal, shipping, grandTotal }
 */
export function calculateTotals(items = [], method = 'pickup') {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(method, subtotal);
  const grandTotal = subtotal + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

export default function usePriceCalculator() {
  const shippingFee = DELIVERY_FEE;

  return {
    // Constants
    shippingFee,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    // Functions
    getItemPrice,
    getItemTotal,
    calculateSubtotal,
    calculateShipping,
    calculateTotals,
  };
}
