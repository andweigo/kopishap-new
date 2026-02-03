// src/components/cards/BaseProductCard.jsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const getDisplayPrice = (price) => {
  if (typeof price === 'number') return `₱${price}`;
  if (typeof price === 'object') return `₱${price.S} - ₱${price.XL}`;
  return '₱0';
};

const BaseProductCard = ({ item, height, children, footer }) => {
  return (
    <View style={[styles.card, { backgroundColor: item.color, height }]}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{getDisplayPrice(item.price)}</Text>

      {children}

      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  image: { width: '100%', height: '50%' },
  name: { fontSize: 12, fontWeight: '700', color: '#000' },
  price: { fontSize: 14, fontWeight: '700', marginTop: 4 },
});

export default BaseProductCard;
