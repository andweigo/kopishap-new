import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../components/ui/ProductCard';
import { getCategoryFromId } from '../constants/categories';
import { ALL_PRODUCTS } from '../data/products';

/**
 * A screen that displays a filtered list of products based on category and search query.
 */
const ProductListScreen = ({ category, searchQuery, targetProductId }) => {
  const flatListRef = useRef(null);

  // 1. Filter all products to get only the ones for the current category.
  // We use toLowerCase() for a case-insensitive match.
  const categoryProducts = ALL_PRODUCTS.filter(
    (product) => {
      // Determine category from explicit type (if exists) or ID prefix
      const productCategory = product.type || getCategoryFromId(product.id);
      return product && productCategory && productCategory.toLowerCase() === category.toLowerCase();
    }
  );

  // 2. If there's a search query, further filter the category products.
  const filteredProducts = searchQuery
    ? categoryProducts.filter((product) =>
        // Also apply a defensive check for product.name to prevent similar crashes.
        product && typeof product.name === 'string' && product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryProducts;

  // 3. Define how to render each product card.
  const renderProductItem = ({ item }) => <ProductCard item={item} cardHeight={400} />;

  // Scroll to the target product if it exists in the current list
  useEffect(() => {
    if (targetProductId && filteredProducts.length > 0) {
      const index = filteredProducts.findIndex((item) => item.id === targetProductId);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }
    }
  }, [targetProductId, filteredProducts]);

  // 4. If no products match the filters, show an empty state message.
  if (filteredProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products found in {category}.</Text>
      </View>
    );
  }

  // 5. Render the final list of products in a horizontal list.
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
    paddingHorizontal: 15, // Give some initial padding for the carousel
    paddingVertical: 10,
    backgroundColor: '#FDF5E6',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDF5E6' },
  emptyText: { fontSize: 16, color: '#95a5a6' },
});

export default ProductListScreen;