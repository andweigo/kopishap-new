/**
 * Hooks Index
 * Centralized exports for all custom hooks
 * Following OOP principles for better organization
 */

// Authentication & User hooks
export { default as useCurrentUser } from './useCurrentUser';
export { default as useUserPreferences } from './useUserPreferences';

// Cart & Orders hooks
export { default as useFavorites } from './useFavorites';
export { default as useUserOrders } from './useUserOrders';

// Product hooks
export { default as useFavoriteButton } from './useFavoriteButton';
export { calculateShipping, calculateSubtotal, calculateTotals, getItemPrice, getItemTotal, default as usePriceCalculator } from './usePriceCalculator';
export { default as useProductSelection } from './useProductSelection';

// UI hooks
export { default as useAutoHideBottomNav } from './useAutoHideBottomNav';
export { default as useFeedbacks } from './useFeedbacks';
export { default as useModal } from './useModal';
export { default as useToast } from './useToast';

