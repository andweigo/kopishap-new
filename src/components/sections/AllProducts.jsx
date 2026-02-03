// src/components/sections/AllProducts.jsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AllProductsCard from '../cards/AllProductsCard';
import EmptyCard from '../ui/EmptyCard';
import NoMatch from '../ui/NoMatch';
import { ALL_PRODUCTS } from '../../data/products';


const { width } = Dimensions.get('window');
const PRODUCT_CARD_HEIGHT = 200;
const ITEM_SPACING = width * 0.05;

const AllProducts = ({ onScroll, searchQuery, setSearchQuery } = {}) => {
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 14;
  const query = (typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '');
  const filtered = query ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query)) : ALL_PRODUCTS;
  const baseData = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const displayData = showAll ? [...baseData, { id: 'placeholder', placeholder: true }] : baseData;

  if (filtered.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <NoMatch onClear={() => setSearchQuery && setSearchQuery('')} />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Kape Doon's Products</Text>
      <FlatList
        data={displayData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.placeholder) return <EmptyCard width={'47%'} height={PRODUCT_CARD_HEIGHT} variant={'grid'} />;
          return <AllProductsCard item={item} height={PRODUCT_CARD_HEIGHT} />;
        }}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        nestedScrollEnabled={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {!showAll && filtered.length > INITIAL_COUNT && (
        <View style={styles.seeMoreContainer}>
          <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowAll(true)} activeOpacity={0.8}>
            <Text style={styles.seeMoreText}>See more products</Text>
          </TouchableOpacity>
        </View>
      )}

      {showAll && filtered.length > INITIAL_COUNT && (
        <View style={styles.seeMoreContainer}>
          <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowAll(false)} activeOpacity={0.8}>
            <Text style={styles.seeMoreText}>Show less</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: ITEM_SPACING,
    marginBottom: 15,
    marginTop: -70,
  },
  listContainer: {
    paddingHorizontal: ITEM_SPACING,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: ITEM_SPACING,
  },
  seeMoreContainer: { alignItems: 'center', marginTop: -12 },
  seeMoreButton: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 30 },
  seeMoreText: { color: '#fff', fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingHorizontal: ITEM_SPACING, paddingBottom: 20 },
});

export default AllProducts;


export { ALL_PRODUCTS } from '../../data/products';