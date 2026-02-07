import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCurrentUser from '../hooks/useCurrentUser';
import useToast from '../hooks/useToast';
import UserService from '../services/UserService';
import StepLogin from './steps/StepLogin';
import StepPreferences from './steps/StepPreferences';
import StepUserInfo from './steps/StepUserInfo';
import StepWelcome from './steps/StepWelcome';
import styles from './styles';

const AuthScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    authMethod: 'password',
  });
  const [preferences, setPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get setUser from context to update global state
  const { setUser } = useCurrentUser();
  const { showError, showSuccess } = useToast();

  const handleInputChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const advanceToStep = (nextStep) => {
    // Validation logic for Step 1 -> Step 2
    if (step === 1 && nextStep === 2) {
      const { name, email, password, confirmPassword, authMethod } = formData;
      const errors = [];

      if (!name || !name.trim()) errors.push('Please enter your name.');
      
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!email || !emailRegex.test(email)) errors.push('Please enter a valid email address.');
      
      const minLen = authMethod === 'pin' ? 4 : 6;
      if (!password || password.length < minLen) errors.push(`Password/PIN must be at least ${minLen} characters.`);
      
      if (password !== confirmPassword) errors.push('Passwords do not match.');

      if (errors.length > 0) {
        errors.forEach(err => showError(err));
        return;
      }
    }
    setStep(nextStep);
  };

  const handleLoginVerify = (email, password) => {
    const errors = [];
    if (email.toLowerCase().trim() !== formData.email.toLowerCase().trim()) {
      errors.push('Email does not match your registration email.');
    }
    if (password !== formData.password) {
      errors.push('Credentials do not match.');
    }
    if (errors.length > 0) {
      errors.forEach(err => showError(err));
      return;
    }
    // If successful, move to preferences
    setStep(3);
  };

  const handleRegistrationComplete = async (allowEmpty = false) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsLoading(true);
    try {
      // Final validation
      const { name, email, password, confirmPassword, authMethod } = formData;
      const errors = [];
      if (!name || !name.trim()) errors.push('Please enter your name.');
      const minLen = authMethod === 'pin' ? 4 : 6;
      if (!password || password.length < minLen) errors.push('Invalid credentials length.');
      if (password !== confirmPassword) errors.push('Passwords do not match.');
      if (!allowEmpty && (!preferences || preferences.length === 0)) {
        errors.push('Please choose at least one preference.');
      }

      if (errors.length > 0) {
        errors.forEach(err => showError(err));
        setIsSubmitting(false);
        setIsLoading(false);
        return;
      }

      const result = await UserService.registerUser({
        name,
        email,
        password,
        confirmPassword,
        authMethod,
        preferences: allowEmpty ? [] : preferences,
      });

      if (result.success) {
        console.log('AuthScreen: Registration successful, updating context...');
        
        // 1. Reset local form state
        setStep(0);
        setFormData({ name: '', email: '', password: '', confirmPassword: '', authMethod: 'password' });
        setPreferences([]);
        
        // 2. Update global user state. 
        // This triggers AppStack to re-render and switch to AppDrawer automatically.
        setUser(result.user);
        showSuccess('Welcome to Kape Doon!');
      } else {
        showError(result?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError(error.message || 'Unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && <StepWelcome onNext={() => advanceToStep(1)} />}

          {step === 1 && (
            <StepUserInfo
              formData={formData}
              onChange={handleInputChange}
              onNext={() => advanceToStep(2)}
              onBack={() => setStep(0)}
            />
          )}

          {step === 2 && (
            <StepLogin
              formData={formData}
              onLogin={handleLoginVerify}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepPreferences
              preferences={preferences}
              setPreferences={setPreferences}
              onNext={() => handleRegistrationComplete(false)}
              onSkip={() => handleRegistrationComplete(true)}
              onBack={() => setStep(2)}
              isLoading={isLoading}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
