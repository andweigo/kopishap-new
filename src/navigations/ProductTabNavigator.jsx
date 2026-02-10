import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { CATEGORIES } from '../constants/categories';
import ProductListScreen from '../screens/ProductListScreen';

const Tab = createMaterialTopTabNavigator();

/**
 * This is the Top Tab Navigator for product categories.
 * It receives the `initialTab` prop from Home.jsx and uses it
 * to set the `initialRouteName`.
 */
const ProductTabNavigator = ({ searchQuery, initialTab, targetProductId }) => {
  // This console log is for debugging. You can check your Metro logs
  // to confirm that the correct category is being received from Home.jsx.
  console.log('[ProductTabNavigator] Initializing with tab:', initialTab);

  return (
    <Tab.Navigator
      // This is the crucial fix: Use the prop to set the initial route.
      initialRouteName={initialTab}
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
        tabBarIndicatorStyle: { backgroundColor: '#000000', height: 2 },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 13 },
        tabBarStyle: { backgroundColor: '#FDF5E6' },
      }}
    >
      {CATEGORIES.map((category) => (
        <Tab.Screen
          key={category}
          name={category}
          children={() => <ProductListScreen category={category} searchQuery={searchQuery} targetProductId={targetProductId} />}
        />
      ))}
    </Tab.Navigator>
  );
};

export default ProductTabNavigator;