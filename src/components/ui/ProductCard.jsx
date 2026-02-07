// src/components/ui/ProductCard.jsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useCart } from '../../context/CartContext';
import FavoriteButton from './FavoriteButton';

const { width } = Dimensions.get('window');

const ProductCard = ({ item, compact = false, cardHeight }) => {
  const navigation = useNavigation();
  const CARD_WIDTH = compact ? width * 0.5 : width * 0.8;
  const CARD_HEIGHT = cardHeight || width * 1;

  const { addItem } = useCart();

  const selectedSize = item.size || 'L';
  const price = typeof item.price === 'object' ? item.price[selectedSize] ?? 0 : item.price;

  return (
    <View style={[styles.productCard, { width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: item.color || '#FDF5E6' }]}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.iconRow}>
          <FavoriteButton item={item} size={18} style={{ marginRight: -8 }} />
          <TouchableOpacity style={styles.cartIconContainer} onPress={() => addItem(item)}>
            <Icon name="shopping-cart" size={18} color="#000" />
            <View style={styles.addBadge}>
              <Text style={styles.addBadgeText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Image source={item.image} style={styles.productImage} resizeMode="contain" />

      <TouchableOpacity
        style={styles.buyButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Buy', { product: item })}
      >
        <Text style={styles.buyButtonPrice}>₱{price}</Text>
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    height: width * 1,
    borderRadius: 30,
    padding: 20,
    marginRight: width * 0.05,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 18, fontWeight: '700', color: '#000' },
  productImage: { width: '100%', height: '60%' },
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(0, 0, 0)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buyButtonPrice: { fontSize: 16, fontWeight: '700', color: '#ffff' },
  buyButtonText: { fontSize: 16, fontWeight: '700', color: '#ffff' },
  cartIconContainer: { position: 'relative', padding: 6 },
  addBadge: { position: 'absolute', right: -6, top: -6, backgroundColor: '#000', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  addBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default ProductCard;
