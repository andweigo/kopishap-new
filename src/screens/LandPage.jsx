import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const LandPage = ({ navigation }) => {
  const handleStartPress = () => {
    navigation.replace('AuthScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      
      <View style={styles.contentContainer}>
        <Image
          source={ require('../imgs/logo.png') } 
          style={styles.logo}
        />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleStartPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  contentContainer: {
    flex: 3, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 20,
  },
  logo: {
    width: width * 0.8, 
    height: width * 0.8,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 50, 
    width: '60%', 
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default LandPage;