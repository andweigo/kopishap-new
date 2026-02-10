import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import FeedbackCard from './FeedbackCard';

/**
 * AllFeedbacksModal - Displays all customer feedbacks in a modal
 */
const AllFeedbacksModal = ({ visible, onClose, allFeedbacks, averageRating, totalCount }) => {
  const insets = useSafeAreaInsets();

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={16}
            color={star <= Math.round(rating) ? '#FFC107' : '#E8E8E8'}
            style={styles.star}
            fill={star <= Math.round(rating) ? '#FFC107' : 'none'}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Reviews</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Overall Rating */}
          <View style={styles.overallRatingContainer}>
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
              <Text style={styles.ratingLabel}>out of 5</Text>
            </View>
            <View style={styles.ratingStars}>
              {renderStars(averageRating)}
            </View>
            <Text style={styles.ratingCount}>{totalCount} {totalCount === 1 ? 'user gave' : 'users gave'} their thoughts</Text>
          </View>

          {/* Feedbacks List */}
          <ScrollView style={styles.feedbacksScroll} showsVerticalScrollIndicator={false}>
            {allFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FDF5E6',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 8,
  },
  overallRatingContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginRight: 4,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#999',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  feedbacksScroll: {
    flex: 1,
  },
});

export default AllFeedbacksModal;
