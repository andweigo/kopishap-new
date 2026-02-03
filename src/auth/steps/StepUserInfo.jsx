import React from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const { width } = Dimensions.get('window');

const StepUserInfo = ({ formData, onChange, onNext, onBack }) => {
  return (
    <View style={styles.stepContainer}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={28} color="#2c3e50" />
        </TouchableOpacity>
      )}


      <View style={styles.contentCard}>

        <Image
          source={require('../../imgs/welcome/wondering.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          placeholder="Name"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => onChange('name', text)}
        />
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#95a5a6"
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => onChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="#95a5a6"
          secureTextEntry
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => onChange('password', text)}
        />
        
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#95a5a6"
          secureTextEntry
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(text) => onChange('confirmPassword', text)}
        />
        
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Next</Text>
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

  image: {
    width: 300,
    height: 300,
    marginBottom: 5,
    marginTop: -60,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'black',
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
    elevation: 5,
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  arrowText: {
    fontSize: 22,
    color: '#2c3e50',
    fontWeight: 'bold',
    bottom: 5,
  },
});

export default StepUserInfo;
