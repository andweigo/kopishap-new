import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import LandPage from "../screens/LandPage";
import Buy from "../screens/Buy";
import Cart from "../screens/Cart";
import Checkout from "../screens/CheckOut";
import SettingsScreen from "../screens/SettingsScreen";
import AuthScreen from "../auth/AuthScreen";


const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="LandPage" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="LandPage"
        component={LandPage}
        options={{ title: "LandPage" }}
      />


      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ title: "AuthScreen" }}
      />


      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />

      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ title: "Cart" }}
      />

      <Stack.Screen
        name="Buy"
        component={Buy}
        options={{ title: "Buy" }}
      />

      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{ title: "Checkout" }}
      />

        <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
