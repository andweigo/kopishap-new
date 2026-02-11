import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../components/ui/ProductCard';
import { getCategoryFromId } from '../constants/categories';
import { ALL_PRODUCTS } from '../data/products';

const ProductListScreen = ({ category, searchQuery, targetProductId }) => {
  const flatListRef = useRef(null);

  const categoryProducts = ALL_PRODUCTS.filter(
    (product) => {
      const productCategory = product.type || getCategoryFromId(product.id);
      return product && productCategory && productCategory.toLowerCase() === category.toLowerCase();
    }
  );

  const filteredProducts = searchQuery
    ? categoryProducts.filter((product) =>
        product && typeof product.name === 'string' && product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryProducts;

  const renderProductItem = ({ item }) => <ProductCard item={item} cardHeight={400} />;

  useEffect(() => {
    if (targetProductId && filteredProducts.length > 0) {
      const index = filteredProducts.findIndex((item) => item.id === targetProductId);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }
    }
  }, [targetProductId, filteredProducts]);

  if (filteredProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found in {category}.</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      key="horizontal-list"
      data={filteredProducts}
      horizontal={true}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsHorizontalScrollIndicator={false}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FDF5E6',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF5E6' },
  emptyText: { fontSize: 16, color: '#95a5a6' },
});

export default ProductListScreen;