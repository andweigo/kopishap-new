import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const ModalButton = ({ title, onPress, variant = 'primary', style, textStyle }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'danger': return styles.danger;
      default: return styles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondaryText;
      default: return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#000000' },
  secondary: { backgroundColor: '#F0F0F0' },
  danger: { backgroundColor: '#E74C3C' },
  text: { fontSize: 14, fontWeight: '600' },
  primaryText: { color: '#FFFFFF' },
  secondaryText: { color: '#333333' },
});

export default ModalButton;