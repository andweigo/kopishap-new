import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const StepPreferences = ({ preferences, setPreferences, onNext, onBack, onSkip, isLoading = false }) => {
  // Use actual product categories instead of individual products
  const categories = ['Coffee', 'Lemonade', 'Pastries', 'Specials', 'Merch'];

  // Disable finish button if no preferences selected
  const isPreferencesValid = preferences && preferences.length > 0;

  const toggleOption = (item) => {
    if (preferences.includes(item)) {
      setPreferences(preferences.filter((p) => p !== item));
    } else {
      setPreferences([...preferences, item]);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack} 
          disabled={isLoading}
        >
          <Icon name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Customize Preferences</Text>
        <Text style={styles.subtitle}>Select what you love, skip the rest</Text>
        
        <View style={styles.optionsContainer}>
          {categories.map((item) => {
            const selected = preferences.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.preferencesOption,
                  selected && styles.preferencesOptionSelected,
                ]}
                onPress={() => toggleOption(item)}
                activeOpacity={0.6}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.preferencesText,
                    selected && styles.preferencesTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {selected && (
                  <Icon name="check" size={16} color="#000000" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {isPreferencesValid ? (
          <PrimaryButton
            title="Complete Setup"
            onPress={onNext}
            icon="arrow-right"
            loading={isLoading}
          />
        ) : (
          <PrimaryButton
            title="Skip"
            onPress={onSkip}
            loading={isLoading}
            style={{ backgroundColor: '#666' }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: '#fdf5e6',
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

  optionsContainer: {
    flex: 1,
    marginBottom: 32,
  },

  preferencesOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fdf5e6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000000',
  },

  preferencesOptionSelected: {
    backgroundColor: '#F0F0F0',
    borderColor: '#000000',
  },

  preferencesText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },

  preferencesTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
});

export default StepPreferences;
