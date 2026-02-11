import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CANCELLATION_REASONS = [
  'Ordered by mistake (wrong item, wrong quantity, duplicate order)',
  'Incorrect delivery address',
  'Wrong payment method used',
  'Found a better price elsewhere',
  'Delivery time is too long',
  'Changed mind / no longer needed',
  'Emergency came up',
  'Wrong item selected (size, color, variant, flavor, etc.)',
  'Budget concerns',
  'Placed order as a test / accidental checkout',
  'Other',
];

const CancelOrderModal = ({ visible, onClose = () => {}, onConfirm = () => {} }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState('');

  const handleConfirm = () => {
    const isOther = selectedReason === 'Other';
    const reason = isOther ? otherReasonText.trim() : selectedReason;

    if (reason) {
      onConfirm(reason);
      setSelectedReason(null);
      setOtherReasonText('');
    }
  };

  const handleClose = () => {
      setSelectedReason(null);
      setOtherReasonText('');
      onClose();
  }

  const isConfirmDisabled = !selectedReason || (selectedReason === 'Other' && !otherReasonText.trim());

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to cancel this order?</Text>
            <Text style={styles.modalSubtitle}>Please select a reason for cancellation:</Text>
            
            <ScrollView
              style={styles.reasonsContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {CANCELLATION_REASONS.map((reason) => (
                <View key={reason}>
                  <TouchableOpacity
                    style={styles.reasonRow}
                    onPress={() => setSelectedReason(reason)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={selectedReason === reason ? 'check-circle' : 'circle'}
                      size={20}
                      color={selectedReason === reason ? '#000' : '#CCC'}
                    />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </TouchableOpacity>
                  {reason === 'Other' && selectedReason === 'Other' && (
                    <TextInput
                      style={styles.otherReasonInput}
                      placeholder="Please specify your reason"
                      placeholderTextColor="#999"
                      value={otherReasonText}
                      onChangeText={setOtherReasonText}
                      autoFocus
                    />
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose} activeOpacity={0.8}>
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, isConfirmDisabled && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={isConfirmDisabled}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  reasonsContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  reasonText: { fontSize: 15, color: '#374151', marginLeft: 12, flex: 1 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 16 },
  otherReasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    marginTop: 8,
    marginLeft: 32,
    marginRight: 10,
  },
  button: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelButtonText: { color: '#4B5563', fontWeight: '600' },
  confirmButton: { backgroundColor: '#e74c3c' },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  disabledButton: { backgroundColor: '#D1D5DB' },
});

export default CancelOrderModal;