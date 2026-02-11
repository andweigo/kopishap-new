import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import useFeedbacks from '../../hooks/useFeedbacks';
import useModal from '../../hooks/useModal';
import FeedbackService from '../../services/FeedbackService';
import AllFeedbacksModal from '../ui/AllFeedbacksModal';
import FeedbackCard from '../ui/FeedbackCard';
import AddFeedbackForm from './AddFeedbackForm';

const FeedbacksSection = () => {
  const [allFeedbacksVisible, setAllFeedbacksVisible] = useState(false);
  const alertModal = useModal();
  const [submitting, setSubmitting] = useState(false);

  const {
    randomizedFeedbacks,
    allFeedbacks,
    averageRating,
    totalFeedbackCount,
    loadFeedbacks,
  } = useFeedbacks();

  const handleSubmitFeedback = async (feedbackData) => {
    setSubmitting(true);
    try {
      await FeedbackService.addFeedback(feedbackData);
      await loadFeedbacks();
      alertModal.show('Feedback Sent', 'We appreciate your contribution!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alertModal.show('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={12}
            color={star <= Math.round(rating) ? '#FFC107' : '#E8E8E8'}
            fill={star <= Math.round(rating) ? '#FFC107' : 'none'}
            style={styles.star}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.reviewsSection}>

      <View style={styles.reviewsHeaderContainer}>
        <View style={styles.reviewsHeader}>
          <Icon name="star" size={20} color="#FFC107" fill="#FFC107" />
          <Text style={styles.reviewsTitle}>Customer Reviews</Text>
        </View>
        <TouchableOpacity
          onPress={() => setAllFeedbacksVisible(true)}
          style={styles.viewMoreButton}
          activeOpacity={0.7}
        >
          <Text style={styles.viewMoreText}>View More</Text>
          <Icon name="chevron-right" size={16} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.ratingValue}>
          <Text style={styles.rating}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.ratingLabel}>out of 5</Text>
        </View>
        {renderStars(averageRating)}
        <Text style={styles.ratingCount}>
          {totalFeedbackCount} {totalFeedbackCount === 1 ? 'user gave' : 'users gave'} their thoughts
        </Text>
      </View>

      <Text style={styles.reviewsSubtitle}>What our customers are saying</Text>

      <View style={styles.feedbacksList}>
        {randomizedFeedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </View>

      <AddFeedbackForm onSubmit={handleSubmitFeedback} loading={submitting} />

      <AllFeedbacksModal
        visible={allFeedbacksVisible}
        onClose={() => setAllFeedbacksVisible(false)}
        allFeedbacks={allFeedbacks}
        averageRating={averageRating}
        totalCount={totalFeedbackCount}
      />

      <Modal
        visible={alertModal.visible}
        transparent
        animationType="fade"
        onRequestClose={alertModal.hide}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{alertModal.title}</Text>
            <Text style={styles.modalMessage}>{alertModal.message}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={alertModal.hide}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FDF5E6',
  },

  reviewsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reviewsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 10,
  },

  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fdf5e6',
  },

  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 4,
  },

  ratingContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
  },

  ratingValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },

  rating: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginRight: 4,
  },

  ratingLabel: {
    fontSize: 12,
    color: '#999',
  },

  starsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  star: {
    marginRight: 3,
  },

  ratingCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  reviewsSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },

  feedbacksList: {
    marginTop: 8,
    marginBottom: 12,
  },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50', textAlign: 'center' },
  modalMessage: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 25 },
  modalButton: { width: '100%', paddingVertical: 12, borderRadius: 10, backgroundColor: '#000', alignItems: 'center' },
  modalButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
});

export default FeedbacksSection;
