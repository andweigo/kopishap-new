import React from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const StepWelcome = ({ onNext, onBack }) => {
  return (
    <View style={styles.stepContainer}>

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-left" size={28} color="#2c3e50" />
        </TouchableOpacity>
      )}

      <View style={styles.contentCard}>
        <Image
          source={require('../../imgs/welcome/welcome.png')}
          style={styles.logo}
        />
        
        <Text style={styles.title}>Welcome to Kape Doon!</Text>
        
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Be a part of Kape Doon's family</Text>
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
    top: 50,
    left: 20,
    zIndex: 10,
  },

  contentCard: {
    backgroundColor: '#FDF5E6',
    borderRadius: 40,
    width: Math.min(width - 40, 400),
    padding: 40,
    paddingVertical: 50,
    alignItems: 'center',
    marginTop: 100,
  },

  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
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
    marginTop: 50,
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
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 2,
  },

  arrowText: {
    fontSize: 22,
    color: '#2c3e50',
    fontWeight: 'bold',
    bottom: 5,
  },
});

export default StepWelcome;
