import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import ProductCard from '../ui/ProductCard';
import EmptyCard from '../ui/EmptyCard';
import { ALL_PRODUCTS } from '../sections/AllProducts';

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = width * 0.8;
const ITEM_SPACING = width * 0.05;
const PRODUCTS = ALL_PRODUCTS.filter(p => typeof p.id === 'string' && p.id.startsWith('m'));

const MerchTab = ({ searchQuery = '', suppressEmpty = false }) => {
  const query = (searchQuery || '').trim().toLowerCase();
  const filtered = query ? PRODUCTS.filter(p => p.name.toLowerCase().includes(query)) : PRODUCTS;
  if (filtered.length === 0 && suppressEmpty) return null;
  const displayData = filtered.length ? [...filtered, { id: 'placeholder', placeholder: true }] : [{ id: 'empty' }];

  const renderItem = ({ item }) => {
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

});

export default MerchTab;
