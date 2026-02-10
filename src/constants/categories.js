/**
 * Shared constants for category configuration across the app.
 */
export const CATEGORY_STORAGE_KEY = 'userCategoryPreference';
export const SEARCH_INTENT_KEY = 'userSearchIntent';
export const DEFAULT_CATEGORY = 'Coffee';
export const CATEGORIES = ['Coffee', 'Lemonade', 'Pastries', 'Specials', 'Merch'];

// Helper to determine category from ID prefix since data.json lacks 'type'
export const getCategoryFromId = (id) => {
  if (!id) return '';
  const prefix = id.charAt(0).toLowerCase();
  const categoryMap = {
    c: 'Coffee',
    l: 'Lemonade',
    p: 'Pastries',
    s: 'Specials',
    m: 'Merch',
  };
  return categoryMap[prefix] || '';
};