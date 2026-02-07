import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppStack from './src/navigations/AppStack';

const App = () => {
  return (
    <NavigationContainer>
      
      <SafeAreaProvider>
        <AppStack />
      </SafeAreaProvider>

    </NavigationContainer>
  );
};

export default App;