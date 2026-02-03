import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Checkout() {
  const navigation = useNavigation();
  const route = useRoute();

  const { items = [] } = route.params || {};

  const [modalVisible, setModalVisible] = useState(false);

  const getPrice = (item) => {
    if (typeof item.price === 'object') {
      return item.price[item.size || 'L'] ?? 0;
    }
    return item.price ?? 0;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + getPrice(item) * (item.quantity || 1),
    0
  );

  const shipping = 50;
  const grandTotal = subtotal + shipping;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout List</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.imageBox}>
                {item.image && <Image source={item.image} style={styles.image} />}
              </View>

              <View style={styles.textArea}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.type && <Text style={styles.itemType}>{item.type}</Text>}
                {item.size && <Text style={styles.itemSize}>Size: {item.size}</Text>}
                <Text style={styles.itemPrice}>₱{getPrice(item)}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity || 1}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sub Total</Text>
            <Text style={styles.priceValue}>₱{subtotal}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee</Text>
            <Text style={styles.priceValue}>₱{shipping}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>₱{grandTotal}</Text>
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.9}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Icon name="check-circle" size={48} color="#27ae60" />
            <Text style={styles.modalTitle}>Order Listed!</Text>
            <Text style={styles.modalMessage}>
              Your order has been listed.{'\n'}
              Please proceed to the counter.{'\n'}
              Thank you!
            </Text>

            <TouchableOpacity
  style={styles.modalButton}
  onPress={() => {
    setModalVisible(false);
    navigation.navigate('Home');
  }}
>
  <Text style={styles.modalButtonText}>OK</Text>
</TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  backButton: { marginRight: 16 },

  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#000' },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 180,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  cardContent: { flexDirection: 'row', alignItems: 'center' },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#C4B5A0',
    marginRight: 16,
    overflow: 'hidden',
  },

  image: { width: '100%', height: '100%', borderRadius: 16 },

  textArea: { flex: 1 },

  itemName: { fontSize: 18, fontWeight: '600', marginBottom: 6 },

  itemType: { fontSize: 14, color: '#666', marginBottom: 4 },

  itemSize: { fontSize: 14, color: '#666', marginBottom: 4 },

  itemPrice: { fontSize: 16, fontWeight: '700', marginBottom: 4 },

  itemQty: { fontSize: 14, color: '#666' },

  priceSection: { marginBottom: 16 },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  priceLabel: { fontSize: 15, color: '#666' },

  priceValue: { fontSize: 15, color: '#666' },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: { fontSize: 18, fontWeight: '600', color: '#333' },

  totalValue: { fontSize: 18, fontWeight: '600', color: '#333' },

  floatingButtonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    alignItems: 'center',
  },

  floatingButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 60,
  },

  floatingButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },

  modalButton: {
    backgroundColor: '#000',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },

  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
