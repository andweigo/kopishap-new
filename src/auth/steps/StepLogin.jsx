import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const StepLogin = ({ formData, onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isPin = formData.authMethod === 'pin';

  const handleVerify = () => {
    onLogin(email, password);
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Verify Login</Text>
        <Text style={styles.subtitle}>
          Please enter your credentials to verify your account.
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#a8a8a8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isPin ? 'Enter PIN' : 'Enter Password'}</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                placeholder={isPin ? "Enter your PIN" : "Enter your password"}
                placeholderTextColor="#a8a8a8"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                keyboardType={isPin ? 'numeric' : 'default'}
                maxLength={isPin ? 6 : undefined}
              />
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon 
                  name={showPassword ? 'eye' : 'eye-off'} 
                  size={18} 
                  color="#999999" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PrimaryButton
          title="Verify & Continue"
          onPress={handleVerify}
          icon="arrow-right"
          style={{ marginTop: 32 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: '#Fdf5e6',
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fdf5e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 32,
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fdf5e6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  passwordInputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#fdf5e6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    paddingRight: 40,
  },
  iconButton: { position: 'absolute', right: 0, padding: 8 },
});

export default StepLogin;