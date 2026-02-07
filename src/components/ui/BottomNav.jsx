import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useCart } from '../../context/CartContext';
import useAutoHideBottomNav from '../../hooks/useAutoHideBottomNav';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const navigation = useNavigation();
  const { cartItems } = useCart();
  const { visible } = useAutoHideBottomNav();
  const anim = useRef(new Animated.Value(0));

  const BOTTOM_NAV_HEIGHT = 50;
  const BOTTOM_NAV_PADDING = 25;
  const BOTTOM_NAV_PEEK = 12;
  const HIDE_OFFSET = BOTTOM_NAV_HEIGHT + BOTTOM_NAV_PADDING - BOTTOM_NAV_PEEK;

  useEffect(() => {
    Animated.timing(anim.current, {
      toValue: visible ? 0 : 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const iconColor = (name) => (activeTab === name ? '#FFF' : '#888');

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Animated.View
      style={[
        styles.bottomNavContainer,
        { transform: [{ translateY: anim.current.interpolate({ inputRange: [0, 1], outputRange: [0, HIDE_OFFSET] }) }] },
      ]}
    >
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => { setActiveTab('home'); navigation.navigate('HomeStack'); }}
          accessible
          accessibilityLabel="Home"
        >
          <Icon name="home" size={20} color={iconColor('home')} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { setActiveTab('cart'); navigation.navigate('HomeStack', { screen: 'Cart' }); }}
          accessible
          accessibilityLabel="Cart"
          style={styles.cartIconWrapper}
        >
          <Icon name="shopping-cart" size={20} color={iconColor('cart')} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => { setActiveTab('user'); navigation.navigate('Settings'); }}
          accessible
          accessibilityLabel="Profile"
        >
          <Icon name="user" size={20} color={iconColor('user')} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '75%',
    height: 50,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  cartIconWrapper: { position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#E74C3C',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});

export default BottomNav;
