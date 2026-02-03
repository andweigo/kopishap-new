import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './src/navigations/AppStack';
import { CartProvider } from './src/context/CartContext';

const App = () => {
  return (
    <NavigationContainer>
      
      <SafeAreaProvider>
        <CartProvider>
          <AppStack />
        </CartProvider>
      </SafeAreaProvider>

    </NavigationContainer>
  );
};

export default App;