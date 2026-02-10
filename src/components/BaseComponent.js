import { Platform, StyleSheet } from 'react-native';

class BaseComponent {
  constructor() {
    this.platform = Platform.OS;
    this.isAndroid = this.platform === 'android';
    this.isIOS = this.platform === 'ios';
  }

  createStyles(styles) {
    return StyleSheet.create(styles);
  }


  ifAndroid(androidValue, iosValue) {
    return this.isAndroid ? androidValue : iosValue;
  }


  createContainer(styles) {
    return {
      flex: 1,
      ...styles,
    };
  }
}

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

export const mergeStyles = (...styles) => {
  return styles.reduce((acc, style) => {
    if (!style) return acc;
    return { ...acc, ...style };
  }, {});
};

export const Validation = {
  isEmpty: (value) => value === null || value === undefined || value === '',
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhoneNumber: (phone) => /^[0-9]{10,11}$/.test(phone.replace(/\D/g, '')),
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
};


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


export const storage = {
  setItem: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Failed to save data to storage', e);
    }
  },
  getItem: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to fetch data from storage', e);
      return null;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove data from storage', e);
    }
  },
};

export default BaseComponent;
