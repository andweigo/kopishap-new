import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * UserService - Handles user data persistence with AsyncStorage
 * OOP approach with encapsulated business logic
 */
class UserService {
  constructor() {
    this.USER_STORAGE_KEY = STORAGE_KEYS.USER;
    this.USERS_LIST_KEY = STORAGE_KEYS.USERS_LIST;
  }

  /**
   * Helper method to persist user updates to both session and list storage
   * Encapsulates storage logic (DRY Principle)
   * @param {Object} updatedUser 
   */
  async _persistUserUpdate(updatedUser) {
    await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(updatedUser));
    const users = await this.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      await AsyncStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(users));
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, preferences }
   * @returns {Promise<Object>} - { success: boolean, message: string, user: Object }
   */
  async registerUser(userData) {
    try {
      const { name, email, password, confirmPassword, preferences = [], authMethod = 'password' } = userData;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return {
          success: false,
          message: 'All fields are required',
        };
      }

      if (password !== confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
        };
      }

      if (password.length < (authMethod === 'pin' ? 4 : 6)) {
        return {
          success: false,
          message: 'Password must be at least 6 characters',
        };
      }

      // Check if user already exists
      const existingUsers = await this.getAllUsers();
      const userExists = existingUsers.some((user) => user.email === email);

      // Create user object
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, should be hashed
        authMethod,
        preferences,
        createdAt: new Date().toISOString(),
      };

      // Save to AsyncStorage
      const users = existingUsers;
      users.push(newUser);
      await AsyncStorage.setItem(this.USERS_LIST_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(newUser));
      console.log('UserService: registered new user', { id: newUser.id, email: newUser.email });

      return {
        success: true,
        message: 'Registration successful',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, preferences: newUser.preferences },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Login user with credentials
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} - { success: boolean, message: string, user: Object }
   */
  async loginUser(email, password) {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required',
        };
      }

      const users = await this.getAllUsers();
      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Save current user session
      await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      console.log('UserService: loginUser saved session for', user.email);

      return {
        success: true,
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, preferences: user.preferences || [] },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get currently logged-in user
   * @returns {Promise<Object|null>}
   */
  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(this.USER_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update user preferences
   * @param {Array} preferences
   * @returns {Promise<Object>}
   */
  async updateUserPreferences(preferences) {
    try {
      const currentUser = await this.getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: 'No user logged in',
        };
      }

      const updatedUser = { ...currentUser, preferences };
      await this._persistUserUpdate(updatedUser);

      return {
        success: true,
        message: 'Preferences updated',
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all registered users
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_LIST_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Update user profile (address, contact, etc.)
   * @param {Object} profileData - { address, contact }
   * @returns {Promise<Object>}
   */
  async updateUserProfile(profileData) {
    try {
      const currentUser = await this.getCurrentUser();

      if (!currentUser) {
        return {
          success: false,
          message: 'No user logged in',
        };
      }

      const updatedUser = { ...currentUser, ...profileData };
      await this._persistUserUpdate(updatedUser);

      return {
        success: true,
        message: 'Profile updated',
        user: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  async logoutUser() {
    try {
      await AsyncStorage.removeItem(this.USER_STORAGE_KEY);
      // Also reset terms acceptance so next user sees the terms modal
      await AsyncStorage.removeItem(STORAGE_KEYS.TERMS_ACCEPTED);
      console.log('UserService: logoutUser removed current user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  /**
   * Generate and store a random discount (20-100%) for first order only
   * @returns {Promise<number>} - Discount percentage
   */
  async generateAndStoreDiscount() {
    try {
      const discountPercentage = Math.floor(Math.random() * 81) + 20; // 20-100%
      const currentUser = await this.getCurrentUser();
      
      // If user already has a discount (used or unused), do not generate a new one
      if (currentUser?.discount) {
        return 0;
      }

      if (currentUser) {
        const updatedUser = { 
          ...currentUser, 
          discount: discountPercentage, 
          discountUsed: false,
          discountGeneratedAt: new Date().toISOString() 
        };
        await this._persistUserUpdate(updatedUser);
      }
      
      return discountPercentage;
    } catch (error) {
      console.error('Error generating discount:', error);
      return 0;
    }
  }

  /**
   * Get user's unused discount (only if it hasn't been used yet)
   * @returns {Promise<number>} - Discount percentage or 0 if already used
   */
  async getUserDiscount() {
    try {
      const currentUser = await this.getCurrentUser();
      // Return discount only if it exists and hasn't been used yet
      if (currentUser?.discount && !currentUser?.discountUsed) {
        return currentUser.discount;
      }
      return 0;
    } catch (error) {
      console.error('Error getting discount:', error);
      return 0;
    }
  }

  /**
   * Mark user's discount as used (one-time use only)
   * @returns {Promise<void>}
   */
  async markDiscountAsUsed() {
    try {
      const currentUser = await this.getCurrentUser();
      
      if (currentUser) {
        const updatedUser = { ...currentUser, discountUsed: true };
        await this._persistUserUpdate(updatedUser);
      }
    } catch (error) {
      console.error('Error marking discount as used:', error);
    }
  }

  /**
   * Check if user had a discount that was already used
   * @returns {Promise<boolean>} - true if discount exists but was already used
   */
  async isDiscountAlreadyUsed() {
    try {
      const currentUser = await this.getCurrentUser();
      // Return true if discount exists AND has been used
      return currentUser?.discount && currentUser?.discountUsed === true;
    } catch (error) {
      console.error('Error checking discount status:', error);
      return false;
    }
  }

  /**
   * Get the actual discount value (regardless of whether it was used)
   * Used for displaying the discount amount in UI
   * @returns {Promise<number>} - Discount percentage or 0 if no discount exists
   */
  async getDiscountValue() {
    try {
      const currentUser = await this.getCurrentUser();
      return currentUser?.discount || 0;
    } catch (error) {
      console.error('Error getting discount value:', error);
      return 0;
    }
  }

  /**
   * Clear all user data (for testing/reset)
   * @returns {Promise<void>}
   */
  async clearAllData() {
    try {
      await AsyncStorage.removeItem(this.USER_STORAGE_KEY);
      await AsyncStorage.removeItem(this.USERS_LIST_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

// Export singleton instance
export default new UserService();
