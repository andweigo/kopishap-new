import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const PrimaryButton = ({ 
  title, 
  onPress, 
  icon, 
  disabled = false, 
  loading = false, 
  style, 
  textStyle 
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          <Text style={[styles.text, textStyle]}>{title}</Text>
          {icon && <Icon name={icon} size={20} color="#FFFFFF" style={styles.icon} />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabled: { opacity: 0.5 },
  text: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  icon: { marginLeft: 8 },
});

export default PrimaryButton;