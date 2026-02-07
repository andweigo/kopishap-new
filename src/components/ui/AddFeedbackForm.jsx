import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import useToast from '../../hooks/useToast';

/**
 * AddFeedbackForm - Form for users to add their own feedback
 */
const AddFeedbackForm = ({ onSubmit, loading = false }) => {
  const [serviceRating, setServiceRating] = useState(0);
  const [itemsRating, setItemsRating] = useState(0);
  const [comment, setComment] = useState('');
  const { showError } = useToast();

  const handleSubmit = () => {
    if (serviceRating === 0 || itemsRating === 0 || comment.trim() === '') {
      showError('Please complete all fields');
      return;
    }
    onSubmit({
      serviceRating,
      itemsRating,
      comment: comment.trim(),
    });
    // Reset form
    setServiceRating(0);
    setItemsRating(0);
    setComment('');
  };

  const renderStarPicker = (rating, setRating) => {
    return (
      <View style={styles.starPicker}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Icon
              name="star"
              size={20}
              color={star <= rating ? '#FFC107' : '#E8E8E8'}
              fill={star <= rating ? '#FFC107' : 'none'}
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={110}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.container}>
      <Text style={styles.title}>Share Your Experience</Text>

      {/* Service Rating */}
      <View style={styles.ratingRow}>
        <Text style={styles.label}>Service Rating</Text>
        {renderStarPicker(serviceRating, setServiceRating)}
      </View>

      {/* Items Rating */}
      <View style={styles.ratingRow}>
        <Text style={styles.label}>Items Rating</Text>
        {renderStarPicker(itemsRating, setItemsRating)}
      </View>

      {/* Comment */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Feedback</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Tell us about your experience..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          value={comment}
          onChangeText={setComment}
          maxLength={200}
        />
        <Text style={styles.charCount}>{comment.length}/200</Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, (!serviceRating || !itemsRating || !comment.trim() || loading) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!serviceRating || !itemsRating || !comment.trim() || loading}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  ratingRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  starPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default AddFeedbackForm;
