import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const StepPreferences = ({ preferences, setPreferences, onNext, onBack }) => {
  const options = ['Espresso', 'Latte', 'Cappuccino', 'Lemonade', 'Pastries', 'Others'];

  const toggleOption = (item) => {
    if (preferences.includes(item)) {
      setPreferences(preferences.filter((p) => p !== item));
    } else {
      setPreferences([...preferences, item]);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Icon name="arrow-left" size={24} color="#2c3e50" />
      </TouchableOpacity>

      <View style={styles.contentCard}>
        <Text style={styles.title}>Choose your favorites</Text>
        <Text style={styles.subtitle}>Select the items you love</Text>
        
        <View style={styles.optionsContainer}>
          {options.map((item) => {
            const selected = preferences.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.preferencesOption,
                  selected && styles.preferencesOptionSelected,
                ]}
                onPress={() => toggleOption(item)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.preferencesText,
                    selected && styles.preferencesTextSelected,
                  ]}
                >
                  {item}
                </Text>
                {selected && <Icon name="check" size={20} color="#f9ca24" />}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={onNext}>
             <Text style={styles.buttonText}>Finish</Text>
             <View style={styles.arrowContainer}>
             <Text style={styles.arrowText}>→</Text>
            </View>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: '#FDF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  backButton: {
    position: 'absolute',
    top: 10,
    left: 5,
    zIndex: 10,
  },

  contentCard: {
    backgroundColor: '#FDF5E6',
    borderRadius: 40,
    width: Math.min(width - 40, 400),
    padding: 40,
    paddingVertical: 50,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },

  optionsContainer: {
    width: '100%',
    marginBottom: 10,
  },

  preferencesOption: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'black',
  },

  preferencesOptionSelected: {
    backgroundColor: '#fff9e6',
    borderColor: '#f9ca24',
  },

  preferencesText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },

  preferencesTextSelected: {
    fontWeight: '600',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000ff',
    paddingVertical: 16,
    paddingHorizontal: 25,
    paddingRight: 20,
    borderRadius: 30,
    width: '100%',
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'black',
    bottom: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffffff',
    flex: 1,
  },

  arrowContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f9ca24',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderColor: 'white',
    borderWidth: 2,
  },

  arrowText: {
    fontSize: 22,
    color: '#2c3e50',
    fontWeight: 'bold',
    bottom: 5,
  },
});

export default StepPreferences;
