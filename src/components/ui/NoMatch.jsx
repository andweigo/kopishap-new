import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = Math.min(360, SCREEN_WIDTH - 24);

const NoMatch = ({ onClear }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.card, { width: CARD_WIDTH }]}> 
        <Image source={require('../../imgs/no_prod.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>No products found</Text>
        <Text style={styles.subtitle}>Try clearing the search or check other categories.</Text>
        {onClear ? (
          <TouchableOpacity style={styles.button} onPress={onClear} activeOpacity={0.85} accessibilityLabel="Clear search">
            <Text style={styles.buttonText}>Clear search</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 12 },
  card: {
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    marginTop: '-100',
  },
  image: { width: '92%', height: 140, marginBottom: 10, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 6 },
  subtitle: { fontSize: 13, color: '#666', marginTop: 6, textAlign: 'center', marginBottom: 10 },
  button: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, marginTop: 6 },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default NoMatch;
