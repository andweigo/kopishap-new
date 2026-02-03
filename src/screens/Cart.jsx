import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useCart } from '../context/CartContext';
import CartProductCard from '../components/cards/CartProductCard';

export default function KapeCart() {
  const navigation = useNavigation();
  const {
    cartItems, updateQuantity, updateItemSize, toggleSelection, removeItem,
  } = useCart();


  const selectedQuantitySum = cartItems.reduce(
    (acc, item) => acc + (item.selected ? (item.quantity || 0) : 0),
    0
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const buyCount = selectedQuantitySum > 0 ? selectedQuantitySum : totalQuantity;

  const itemsToCheckout = (selectedQuantitySum > 0 ? cartItems.filter(i => i.selected) : cartItems)
    .map(item => ({
      ...item,
      price: typeof item.price === 'object' ? item.price[item.size || 'L'] : item.price ?? 0,
    }));

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={32} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart List</Text>
        <TouchableOpacity style={styles.cartIconButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="shopping-cart" size={24} color="#000" />
          <View style={styles.plusBadge}>
            <Text style={styles.badgeText}>{totalQuantity}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Image source={require('../imgs/no_prod.jpg')} style={styles.emptyStateImage} />
            <Text style={styles.emptyStateText}>Your cart is empty.</Text>
          </View>
        ) : cartItems.map(item => (
          <CartProductCard
            key={item.id}
            item={item}
            updateQuantity={updateQuantity}
            updateItemSize={updateItemSize}
            removeItem={removeItem}
            toggleSelection={toggleSelection}
          />
        ))}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.floatingBuy} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.floatingBuyButton}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Checkout', { items: itemsToCheckout, buyCount })}
          >
            <Text style={styles.floatingBuyText}>Buy Now ({buyCount})</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#000' },
  cartIconButton: { marginLeft: 'auto', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  plusBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  contentContainer: { paddingBottom: 140 },
  cartItem: { backgroundColor: '#B8885F', borderRadius: 30, padding: 20, marginBottom: 20, flexDirection: 'row', position: 'relative', minHeight: 160 },
  imageContainer: { width: 100, height: 100, borderRadius: 20, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  coffeeEmoji: { fontSize: 48 },
  productImage: { width: 90, height: 90, resizeMode: 'contain' },
  itemDetails: { flex: 1, paddingRight: 50 },
  itemName: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  itemPrice: { fontSize: 16, color: '#FFF', fontWeight: '700', marginBottom: 12 },
  sizeContainer: { flexDirection: 'row', marginBottom: 12 },
  sizeButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8E4DD', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  sizeButtonActive: { backgroundColor: '#131313' },
  sizeText: { fontSize: 11, fontWeight: '600' },
  sizeTextActive: { color: '#FFF' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityInline: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { width: 20, height: 20, borderRadius: 14, backgroundColor: '#E8DCC8', justifyContent: 'center', alignItems: 'center' },
  quantityButtonText: { fontSize: 10, fontWeight: '600' },
  quantity: { fontSize: 16, color: '#FFF', fontWeight: '600', marginHorizontal: 12 },
  deleteButton: { width: 20, height: 20, borderRadius: 16, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', left: 20 },
  checkboxContainer: { position: 'absolute', top: 20, right: 20 },
  checkbox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D4C4B0', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#FFF' },
  floatingBuy: { position: 'absolute', left: 20, right: 20, bottom: 24, alignItems: 'center' },
  floatingBuyButton: { paddingHorizontal: 60, paddingVertical: 15, backgroundColor: '#000', borderRadius: 28 },
  floatingBuyText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  emptyStateContainer: { alignItems: 'center', padding: 20 },
  emptyStateImage: { width: 70, height: 70, marginBottom: 12 },
  emptyStateText: { fontSize: 18 },
});
