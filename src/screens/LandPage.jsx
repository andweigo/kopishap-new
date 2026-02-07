import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100, 
    width: '70%', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default LandPage;