import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

/**
 * FeedbackCard - Displays customer review/feedback with ratings
 * Shows service and items ratings as stars
 */
const FeedbackCard = ({ feedback }) => {
  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            size={14}
            color={star <= rating ? '#FFC107' : '#E8E8E8'}
            style={styles.star}
            fill={star <= rating ? '#FFC107' : 'none'}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {/* Header with name */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="user" size={40} color="#BF8F6C" />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{feedback.name}</Text>
          <Text style={styles.date}>{new Date(feedback.date).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{feedback.comment}</Text>

      {/* Ratings */}
      <View style={styles.ratingsContainer}>
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Service</Text>
          {renderStars(feedback.serviceRating)}
        </View>
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Items</Text>
          {renderStars(feedback.itemsRating)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  comment: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    marginBottom: 12,
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingItem: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 3,
  },
});

export default FeedbackCard;
