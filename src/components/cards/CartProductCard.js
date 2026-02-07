import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import SizePicker from '../ui/SizePicker';

const CartProductCard = ({
  item,
  updateQuantity,
  updateItemSize,
  removeItem,
  toggleSelection,
  pickerButtonSize = 20,
}) => {
  const displayPrice = typeof item.price === 'object' ? item.price[item.size || 'L'] ?? 0 : item.price ?? 0;
  const hasSizes = typeof item.price === 'object';

  return (
    <View style={styles.cartItem}>
      {/* Checkbox - Top Left */}
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelection(item.id)}>
        <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
          {item.selected && <Icon name="check" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>

      {/* Product Image - Left Side */}
      <View style={[styles.imageContainer, { backgroundColor: item.color || '#f8f8f8' }]}>
        {item.image ? <Image source={item.image} style={styles.productImage} /> : (
          <View style={styles.imagePlaceholder}><Text style={styles.coffeeEmoji}>☕</Text></View>
        )}
      </View>

      {/* Product Details - Center */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name ?? 'Unknown'}</Text>
        <Text style={styles.itemPrice}>₱{displayPrice}</Text>

        {hasSizes && (
          <View style={styles.sizePickerContainer}>
            <SizePicker value={item.size} onChange={(s) => updateItemSize(item.id, s)} compact buttonSize={pickerButtonSize} spacing={4} />
          </View>
        )}

        <View style={styles.controlsRow}>
          <View style={styles.quantityInline}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity || 0}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delete Button - Right Side */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
        <Icon name="trash-2" size={18} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    marginRight: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    flexShrink: 0,
  },
  imagePlaceholder: { 
    width: '100%', 
    height: '100%', 
    backgroundColor: '#f8f8f8', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  coffeeEmoji: { fontSize: 40 },
  productImage: { width: 70, height: 70, resizeMode: 'contain' },
  itemDetails: { flex: 1, marginRight: 8 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#27ae60', fontWeight: '700', marginBottom: 8 },
  sizePickerContainer: { marginBottom: 8,     right: 35 },
  controlsRow: { flexDirection: 'row', alignItems: 'center' },
  quantityInline: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  quantityButton: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
  quantityButtonText: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  quantity: { fontSize: 13, color: '#2c3e50', fontWeight: '600', marginHorizontal: 10 },
  deleteButton: { 
    width: 30, 
    height: 30, 
    borderRadius: 10, 
    backgroundColor: '#ffe5e5',
    justifyContent: 'center', 
    alignItems: 'center',
    flexShrink: 0,
    top: 30
  },
  checkboxContainer: { position: 'absolute', top: 20, right: 20, zIndex: 10},
  checkbox: { 
    width: 24, 
    height: 24, 
    borderRadius: 6, 
    borderWidth: 2,
    borderColor: '#d0d0d0',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxSelected: { 
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
});

export default CartProductCard;
