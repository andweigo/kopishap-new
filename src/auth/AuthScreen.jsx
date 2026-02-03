import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import StepWelcome from './steps/StepWelcome';
import StepUserInfo from './steps/StepUserInfo';
import StepPreferences from './steps/StepPreferences';
import styles from './styles';

const AuthScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState([]);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && <StepWelcome onNext={() => setStep(1)} />}

        {step === 1 && (
          <StepUserInfo
            formData={formData}
            onChange={handleInputChange}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
          <StepPreferences
            preferences={preferences}
            setPreferences={setPreferences}
            onNext={() =>
              navigation.navigate('Home', { userName: formData.name })
            } // Pass name to Home
            onBack={() => setStep(1)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthScreen;
