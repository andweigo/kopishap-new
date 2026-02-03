import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DEFAULT_CARD_WIDTH = Math.min(180, SCREEN_WIDTH * 0.46);
const DEFAULT_CARD_HEIGHT = DEFAULT_CARD_WIDTH * 0.95;

const EmptyCard = ({ width, height, variant = 'default' }) => {
  const resolvedWidth = width || DEFAULT_CARD_WIDTH;
  const resolvedHeight = height || DEFAULT_CARD_HEIGHT;

  const variantStyles = variant === 'grid' ? styles.gridVariant : variant === 'tab' ? styles.tabVariant : {};

  return (
    <View style={[styles.card, variantStyles.card, { width: resolvedWidth, height: resolvedHeight }]}> 
      <Image source={require('../../imgs/no_prod.jpg')} style={[styles.imagePlaceholder, variantStyles.image]} resizeMode="contain" />
      <Text style={[styles.text, variantStyles.text]}>No Products</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
  },
  imagePlaceholder: { width: '100%', height: '60%', borderRadius: 12, backgroundColor: '#b0b0b0', marginBottom: 10 },
  text: { fontSize: 14, fontWeight: '700', color: '#555' },
  gridVariant: {
    card: { borderRadius: 20, backgroundColor: '#ECECEC' },
    image: { height: '58%' },
    text: { fontSize: 13, color: '#666' },
  },
  tabVariant: {
    card: { borderRadius: 30, backgroundColor: '#d3d3d3' },
    image: { height: '60%' },
    text: { fontSize: 16, color: '#555' },
  },
});

export default EmptyCard;
