import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const StepWelcome = ({ onNext, onBack }) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.contentWrapper}>
        <Text style={styles.tagline}>Welcome</Text>
        
        <Text style={styles.title}>Join Kape Doon</Text>
        
        <Text style={styles.description}>
          Create your account and discover our curated selection of specialty drinks and pastries.
        </Text>
        
        <PrimaryButton
          title="Get Started"
          onPress={onNext}
          style={{ width: '100%', marginBottom: 16 }}
        />

        {onBack && (
          <TouchableOpacity style={styles.textButton} onPress={onBack}>
            <Text style={styles.textButtonLabel}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: '#Fdf5e6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  contentWrapper: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },

  tagline: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 50,
  },

  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    fontWeight: '400',
  },

  textButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },

  textButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999999',
  },
});

export default StepWelcome;
