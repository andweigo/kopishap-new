/**
 * BaseComponent
 * Base class for React Native components following OOP principles
 * Provides common functionality and lifecycle methods
 */
import { Platform, StyleSheet } from 'react-native';

/**
 * Base Component Class
 * Provides common utilities for all components
 */
class BaseComponent {
  constructor() {
    this.platform = Platform.OS;
    this.isAndroid = this.platform === 'android';
    this.isIOS = this.platform === 'ios';
  }

  /**
   * Creates memoized stylesheet
   */
  createStyles(styles) {
    return StyleSheet.create(styles);
  }

  /**
   * Platform-specific value getter
   */
  ifAndroid(androidValue, iosValue) {
    return this.isAndroid ? androidValue : iosValue;
  }

  /**
   * Creates a styled container
   */
  createContainer(styles) {
    return {
      flex: 1,
      ...styles,
    };
  }
}

/**
 * Higher-Order Component wrapper for functional components
 */
export const withBaseComponent = (Component, baseStyles = {}) => {
  return (props) => {
    const base = new BaseComponent();
    
    return (
      <Component 
        {...props} 
        base={base} 
        platform={base.platform}
        isAndroid={base.isAndroid}
        isIOS={base.isIOS}
        createStyles={base.createStyles.bind(base)}
      />
    );
  };
};

/**
 * Hook for platform detection
 */
// Note: platform hook moved to src/hooks/usePlatform.js

/**
 * Common dimension utilities
 */
export const Dimensions = {
  get: (key) => {
    const { Dimensions: RNDimensions } = require('react-native');
    return RNDimensions.get(key);
  },
  getWindow: () => {
    const { Dimensions: RNDimensions } = require('react-native');
    return RNDimensions.get('window');
  },
};

/**
 * Platform-safe style merger
 */
export const mergeStyles = (...styles) => {
  return styles.reduce((acc, style) => {
    if (!style) return acc;
    return { ...acc, ...style };
  }, {});
};

/**
 * Validation utilities
 */
export const Validation = {
  isEmpty: (value) => value === null || value === undefined || value === '',
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhoneNumber: (phone) => /^[0-9]{10,11}$/.test(phone.replace(/\D/g, '')),
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
};

/**
 * Format utilities
 */
export const Format = {
  currency: (amount, currency = '₱') => {
    return `${currency}${Number(amount).toFixed(2)}`;
  },
  date: (dateString, options = {}) => {
    const defaultOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  },
  phoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },
};

export default BaseComponent;
