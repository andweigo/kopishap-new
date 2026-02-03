import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import SizePicker from '../ui/SizePicker';

const CartProductCard = ({
  item,
  updateQuantity,
  updateItemSize,
  removeItem,
  toggleSelection,
  pickerButtonSize = 25,
}) => {
  const displayPrice = typeof item.price === 'object' ? item.price[item.size || 'L'] ?? 0 : item.price ?? 0;
  const hasSizes = typeof item.price === 'object';

  return (
    <View style={styles.cartItem}>
      <View style={[styles.imageContainer, { backgroundColor: item.color || '#FFF' }]}>
        {item.image ? <Image source={item.image} style={styles.productImage} /> : (
          <View style={styles.igePlaceholder}><Text style={styles.coffeeEmoji}>☕</Text></View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name ?? 'Unknown'}</Text>
        <Text style={styles.itemPrice}>₱{displayPrice}</Text>

        {hasSizes && (
          <SizePicker value={item.size} onChange={(s) => updateItemSize(item.id, s)} compact buttonSize={pickerButtonSize} spacing={6} />
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

          <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem(item.id)}>
            <Icon name="trash-2" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelection(item.id)}>
        <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
          {item.selected && <Icon name="check" size={18} color="#000" />}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: { backgroundColor: '#B8885F', borderRadius: 30, padding: 20, marginBottom: 20, flexDirection: 'row', position: 'relative', minHeight: 140 },
  imageContainer: { width: 100, height: 100, borderRadius: 20, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { width: '100%', height: '100%', backgroundColor: '#FFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  coffeeEmoji: { fontSize: 48 },
  productImage: { width: 90, height: 90, resizeMode: 'contain' },
  itemDetails: { flex: 1, paddingRight: 50 },
  itemName: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  itemPrice: { fontSize: 16, color: '#FFF', fontWeight: '700', marginBottom: 12 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityInline: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8DCC8', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  quantityButtonText: { fontSize: 16, fontWeight: '600' },
  quantity: { fontSize: 16, color: '#FFF', fontWeight: '600', marginHorizontal: 12, marginTop: 10 },
  deleteButton: { width: 25, height: 25, borderRadius: 18, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', left: 45, marginTop: 10 },
  checkboxContainer: { position: 'absolute', top: 20, right: 20 },
  checkbox: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D4C4B0', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#FFF' },
});

export default CartProductCard;
