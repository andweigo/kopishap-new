/**
 * Constants Index
 * Centralized constants for the application
 * Following OOP principles for better maintainability
 */

// Storage Keys
export const STORAGE_KEYS = {
  ORDERS: 'kopishap_orders',
  FAVORITES: 'kopishap_favorites',
  USER: 'kopishap_user',
  USERS_LIST: 'kopishap_users_list',
  TERMS_ACCEPTED: 'kopishap_terms_accepted',
};

// Product Sizes
export const PRODUCT_SIZES = {
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
};

export const DEFAULT_SIZE = PRODUCT_SIZES.L;

// Delivery Methods
export const DELIVERY_METHODS = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
};

// Pricing
export const PRICING = {
  DELIVERY_FEE: 50,
  FREE_DELIVERY_THRESHOLD: 0,
  DEFAULT_QUANTITY: 1,
  MAX_QUANTITY: 99,
};

// Navigation
export const NAVIGATION_ROUTES = {
  HOME: 'Home',
  HOME_STACK: 'HomeStack',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  FAVORITES: 'Favorites',
  MY_ORDERS: 'MyOrders',
  ORDER_DETAILS: 'OrderDetails',
  SETTINGS: 'Settings',
  AUTH: 'Auth',
  AUTH_SCREEN: 'AuthScreen',
  LANDING: 'LandPage',
};

// Colors
export const COLORS = {
  PRIMARY: '#FDF5E6',
  SECONDARY: '#000',
  ACCENT: '#B8885F',
  FAVORITE: '#e74c3c',
  SUCCESS: '#27ae60',
  ERROR: '#e74c3c',
  WARNING: '#f39c12',
  TEXT: '#2c3e50',
  TEXT_SECONDARY: '#7f8c8d',
  BORDER: '#E8E4DB',
  BACKGROUND: '#F7EFE3',
};

// Tab Names
export const TAB_NAMES = {
  HOME: 'home',
  CART: 'cart',
  ORDERS: 'orders',
  FAVORITES: 'favorites',
  SETTINGS: 'settings',
};

export const CART_TAB_NAMES = ['All', 'Orders', 'Completed'];

// API Messages
export const MESSAGES = {
  ITEM_ADDED: 'Item added to cart',
  ITEM_REMOVED: 'Item removed from cart',
  ALREADY_ADDED: 'Item already added to cart',
  ADDED_TO_FAVORITES: 'Added to favorites',
  REMOVED_FROM_FAVORITES: 'Removed from favorites',
  NOT_LOGGED_IN: 'Please login to continue',
  ORDER_SAVED: 'Order saved successfully',
  INVALID_ORDER: 'Invalid order data',
};
