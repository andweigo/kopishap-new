import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthScreen from "../auth/AuthScreen";
import DrawerContent from "../components/DrawerContent";
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import useCurrentUser, { UserProvider } from '../hooks/useCurrentUser';
import Buy from "../screens/Buy";
import Cart from "../screens/Cart";
import Checkout from "../screens/CheckOut";
import Favorites from "../screens/Favorites";
import Home from "../screens/Home";
import LandPage from "../screens/LandPage";
import MyOrders from "../screens/MyOrders";
import OrderDetails from "../screens/OrderDetails";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * HomeStack - Stack navigator for home-related screens
 */
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Buy" component={Buy} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
};

/**
 * AuthStack - Stack navigator for authentication screens
 */
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandPage" component={LandPage} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
    </Stack.Navigator>
  );
};

/**
 * AppDrawer - Drawer navigator with main app screens
 * This is rendered ONLY when the user is logged in.
 */
const AppDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.5)",
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeStack" component={HomeStack} options={{ title: "Home" }} />
      <Drawer.Screen name="MyOrders" component={MyOrders} options={{ title: "My Orders" }} />
      <Drawer.Screen name="Favorites" component={Favorites} options={{ title: "Favorites" }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
      <Drawer.Screen name="Checkout" component={Checkout} options={{ title: "Checkout" }} />
    </Drawer.Navigator>
  );
};

/**
 * AuthenticatedStack - Stack navigator for authenticated users
 * Wraps the Drawer and other global screens like OrderDetails
 */
const AuthenticatedStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppDrawer" component={AppDrawer} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
    </Stack.Navigator>
  );
};

/**
 * AppNavigator - Switcher component
 * Decides which stack to show based on user state.
 */
const AppNavigator = () => {
  const { user, loading } = useCurrentUser();
  
  if (loading) {
    // You could return a Splash Screen here
    return null; 
  }

  // If user exists, render the Drawer. If not, render Auth stack.
  return user ? <AuthenticatedStack /> : <AuthStack />;
};

/**
 * AppStack - Root component wrapping the navigator with Context
 */
const AppStack = () => {
  return (
    <UserProvider>
      <ToastProvider>
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </ToastProvider>
    </UserProvider>
  );
};

export default AppStack;
