import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from './UserService';

const STORAGE_KEY = 'USER_FEEDBACKS';

class FeedbackService {
  /**
   * Get all user feedbacks from AsyncStorage
   */
  static async getUserFeedbacks() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting feedbacks:', error);
      return [];
    }
  }

  /**
   * Add a new user feedback
   */
  static async addFeedback(feedback) {
    try {
      const existingFeedbacks = await this.getUserFeedbacks();
      // Attach current user's name if available
      const currentUser = await UserService.getCurrentUser();
      const newFeedback = {
        ...feedback,
        name: feedback.name || currentUser?.name || 'Anonymous',
        id: Date.now() + Math.random(), // Unique ID using timestamp and random
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      };
      const updatedFeedbacks = [...existingFeedbacks, newFeedback];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFeedbacks));
      return newFeedback;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  /**
   * Calculate average rating from all feedbacks
   */
  static async calculateAverageRating() {
    try {
      const userFeedbacks = await this.getUserFeedbacks();
      if (userFeedbacks.length === 0) return 0;

      const totalRating = userFeedbacks.reduce((sum, fb) => {
        const avgFbRating = (fb.serviceRating + fb.itemsRating) / 2;
        return sum + avgFbRating;
      }, 0);

      return totalRating / userFeedbacks.length;
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }

  /**
   * Clear all user feedbacks
   */
  static async clearFeedbacks() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing feedbacks:', error);
    }
  }
}

export default FeedbackService;
