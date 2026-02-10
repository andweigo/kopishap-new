import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FloatingBuyButton = ({ items, buttonLabel, onPress }) => {
  const totalQuantity = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <View style={styles.floatingBuy} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.floatingBuyButton}
        activeOpacity={0.9}
        disabled={totalQuantity === 0}
        onPress={onPress}
      >
        <Text style={styles.floatingBuyText}>{buttonLabel}({totalQuantity})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingBuy: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  floatingBuyButton: {
    paddingHorizontal: 60,
    paddingVertical: 15,
    backgroundColor: '#000',
    borderRadius: 28,
  },
  floatingBuyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default FloatingBuyButton;
