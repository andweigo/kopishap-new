// src/components/cards/AllProductsCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import BaseProductCard from './BaseProductCard';

const AllProductsCard = ({ item, height }) => {
  const navigation = useNavigation();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (typeof item.price === 'object') {
      addItem({ ...item, size: 'M', quantity: 1 });
    } else {
      addItem({ ...item, quantity: 1 });
    }
  };

  const handleBuy = () => {
    navigation.navigate('Buy', { product: item });
  };

  return (
    <BaseProductCard item={item} height={height}>

      <TouchableOpacity style={styles.cartIcon} onPress={handleAddToCart}>
        <Icon name="shopping-cart" size={18} color="#000" />
         <View style={styles.plusBadge}>
            <Text style={styles.plusText}>+</Text>
        </View>
    </TouchableOpacity>

      <TouchableOpacity style={styles.buyBtn} onPress={handleBuy} activeOpacity={0.85}>
        <Text style={styles.buyText}>Buy</Text>
      </TouchableOpacity>
    </BaseProductCard>
  );
};

const styles = StyleSheet.create({
  cartIcon: {
  position: 'absolute',
  top: 12,
  right: 12,
  padding: 6,           // tap area without visible bg
  justifyContent: 'center',
  alignItems: 'center',
},

  plusBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  buyBtn: {
    marginTop: 8,
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default AllProductsCard;
