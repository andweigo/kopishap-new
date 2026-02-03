import React from 'react';
import { FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ProductCard from '../ui/ProductCard';
import EmptyCard from '../ui/EmptyCard';
import { ALL_PRODUCTS } from '../sections/AllProducts';

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = width * 0.8;
const ITEM_SPACING = width * 0.05;
const PRODUCTS = ALL_PRODUCTS.filter(p => typeof p.id === 'string' && p.id.startsWith('c'));


const SeeAllCard = ({ onPress }) => (
  <TouchableOpacity style={styles.seeAllCard} onPress={onPress}>
    <Icon name="arrow-right" size={28} color="#fff" />
  </TouchableOpacity>
);


const CoffeeTab = ({ showAll = false, onSeeAll, searchQuery = '', suppressEmpty = false }) => {
  const query = (searchQuery || '').trim().toLowerCase();
  const filtered = query ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query)) : PRODUCTS;
  if (filtered.length === 0 && suppressEmpty) return null;
  const limitedProducts = filtered.slice(0, 5);
  let displayData = [];
  if (filtered.length === 0) {
    displayData = [{ id: 'empty', placeholder: true }];
  } else if (showAll) {
    displayData = [...filtered, { id: 'placeholder', placeholder: true }];
  } else {
    displayData = limitedProducts.length < filtered.length ? [...limitedProducts, { id: 'seeAll', seeAll: true }] : [...limitedProducts];
  }

  const renderItem = ({ item }) => {
    if (item.seeAll) return <SeeAllCard onPress={onSeeAll} />;
    if (item.id === 'empty' || item.placeholder) return <EmptyCard width={PRODUCT_CARD_WIDTH} height={width * 1} variant={'tab'} />;
    return <ProductCard item={item} />;
  };

  return (
    <FlatList
      data={displayData}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={PRODUCT_CARD_WIDTH + ITEM_SPACING}
      decelerationRate="fast"
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: ITEM_SPACING, paddingRight: width * 0.15 },
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    height: width * 1,
    borderRadius: 30,
    padding: 20,
    marginRight: ITEM_SPACING,
    justifyContent: 'space-between',
  },
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  productImage: { width: '100%', height: '60%', resizeMode: 'contain' },
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buyButtonPrice: { fontSize: 18, fontWeight: 'bold' },
  buyButtonText: { fontSize: 18, fontWeight: 'bold' },
  seeAllCard: {
    width: 50,
    height: PRODUCT_CARD_WIDTH * 0.3,
    backgroundColor: '#000',
    borderRadius: 30,
    marginLeft: 10,
    marginTop: 150,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
});

export default CoffeeTab;
