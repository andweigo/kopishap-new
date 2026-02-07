import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useEffect, useMemo, useRef } from 'react';
import { ALL_PRODUCTS } from '../components/sections/AllProducts';
import CoffeeTab from '../components/tabs/CoffeeTab';
import LemonadeTab from '../components/tabs/LemonadeTab';
import MerchTab from '../components/tabs/MerchTab';
import PastriesTab from '../components/tabs/PastriesTab';
import SpecialTab from '../components/tabs/SpecialTabs';

const Tab = createMaterialTopTabNavigator();

const ProductTabNavigator = ({ searchQuery = '', initialTab = null }) => {
  const tabRef = useRef(null);

  const targetTab = useMemo(() => {
    // If initialTab is provided and valid, use it
    if (initialTab && ['Coffee', 'Lemonade', 'Pastries', 'Specials', 'Merch'].includes(initialTab)) {
      console.log('ProductTabNavigator: using initialTab', initialTab);
      return initialTab;
    }
    
    // Otherwise, search based on query
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return null;
    const match = ALL_PRODUCTS.find(p => typeof p.name === 'string' && p.name.toLowerCase().includes(q));
    if (!match || typeof match.id !== 'string') return null;
    const prefix = match.id[0];
    const map = { c: 'Coffee', l: 'Lemonade', p: 'Pastries', s: 'Specials', m: 'Merch' };
    return map[prefix] || null;
  }, [searchQuery, initialTab]);

  useEffect(() => {
    if (targetTab && tabRef.current) {
      // Use setTimeout to ensure the navigator is fully mounted
      setTimeout(() => {
        if (tabRef.current?.navigate) {
          console.log('ProductTabNavigator: navigating to', targetTab);
          tabRef.current.navigate(targetTab);
        }
      }, 0);
    }
  }, [targetTab]);

  return (
    <Tab.Navigator
      ref={tabRef}
      screenOptions={{
        swipeEnabled: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          textTransform: 'capitalize',
          width: 70
        },
        tabBarStyle: {
          backgroundColor: '#FDF5E6',
          borderBottomWidth: 2,
          borderBottomColor: '#FDF5E6',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#000',
          height: 3,
        },
      }}
    >
      <Tab.Screen name="Coffee" options={{ title: 'Coffee' }}>
        {() => <CoffeeTab searchQuery={searchQuery} />}
      </Tab.Screen>

      <Tab.Screen name="Lemonade" options={{ title: 'Lemonade' }}>
        {() => <LemonadeTab searchQuery={searchQuery} />}
      </Tab.Screen>

      <Tab.Screen name="Pastries" options={{ title: 'Pastries' }}>
        {() => <PastriesTab searchQuery={searchQuery} />}
      </Tab.Screen>

      <Tab.Screen name="Specials" options={{ title: 'Specials' }}>
        {() => <SpecialTab searchQuery={searchQuery} />}
      </Tab.Screen>

      <Tab.Screen name="Merch" options={{ title: 'Merch' }}>
        {() => <MerchTab searchQuery={searchQuery} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default ProductTabNavigator;
