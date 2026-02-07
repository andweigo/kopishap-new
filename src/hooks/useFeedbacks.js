import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import feedbacksData from '../data/feedbacks.json';
import FeedbackService from '../services/FeedbackService';

/**
 * useFeedbacks Hook
 * Manages feedback data fetching and calculations.
 * Separates data logic from the UI component.
 */
export default function useFeedbacks() {
  const [randomizedFeedbacks, setRandomizedFeedbacks] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      // Get user feedbacks from AsyncStorage
      const userFeedbacks = await FeedbackService.getUserFeedbacks();
      
      // Combine with default feedbacks
      const combined = [...feedbacksData, ...userFeedbacks];
      setAllFeedbacks(combined);
      setTotalFeedbackCount(combined.length);

      // Get randomized feedbacks (3 random ones)
      const shuffled = [...combined].sort(() => Math.random() - 0.5);
      setRandomizedFeedbacks(shuffled.slice(0, 3));

      // Calculate average rating
      const avgRating = await FeedbackService.calculateAverageRating();
      const defaultAvg = feedbacksData.length > 0
        ? feedbacksData.reduce((sum, fb) => sum + (fb.serviceRating + fb.itemsRating) / 2, 0) / feedbacksData.length
        : 0;
      
      // If user feedbacks exist, combine with default average
      if (userFeedbacks.length > 0) {
        const totalScore = (defaultAvg * feedbacksData.length) + (avgRating * userFeedbacks.length);
        const combinedAvg = totalScore / combined.length;
        setAverageRating(combinedAvg);
      } else {
        setAverageRating(defaultAvg);
      }
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFeedbacks();
    }, [loadFeedbacks])
  );

  return {
    randomizedFeedbacks,
    allFeedbacks,
    averageRating,
    totalFeedbackCount,
    loading,
    loadFeedbacks,
  };
}