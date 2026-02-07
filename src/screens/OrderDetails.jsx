import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const StatusBadge = ({ status = 'completed' }) => {
  const color = useMemo(() => {
    switch (status) {
      case 'completed':
        return '#27ae60';
      case 'pending':
        return '#f39c12';
      case 'confirmed':
        return '#3498db';
      case 'preparing':
        return '#9b59b6';
      case 'ready':
        return '#2ecc71';
      case 'delivered':
        return '#16a085';
      default:
        return '#95a5a6';
    }
  }, [status]);

  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <Text style={styles.statusText}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</Text>
    </View>
  );
};

export default function OrderDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route?.params?.order || {};

  const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date();
  const dateStr = createdAt.toLocaleString();

  const computedSubtotal = Array.isArray(order?.items)
    ? order.items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0)
    : 0;
  const subtotal = typeof order?.subtotal === 'number' ? order.subtotal : computedSubtotal;
  const shipping = typeof order?.shipping === 'number' ? order.shipping : 0;
  const total = typeof order?.total === 'number' ? order.total : subtotal + shipping;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Icon name="arrow-left" size={28} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Order meta */}
        <View style={styles.metaCard}>
          <View style={styles.metaHeader}>
            <Text style={styles.orderId}>Order #{String(order?.id || '').slice(-6).toUpperCase()}</Text>
            <StatusBadge status={order?.status || 'completed'} />
          </View>
          <Text style={styles.metaSub}>Placed on {dateStr}</Text>
          <Text style={styles.metaSub}>Fulfillment: {order?.deliveryAddress || 'Pickup'}</Text>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {Array.isArray(order?.items) && order.items.map((it) => {
            const unit = it.price || 0;
            const qty = it.quantity || 1;
            const lineTotal = unit * qty;
            return (
              <View key={`${it.id}_${it.size || 'NA'}`} style={styles.itemRow}>
                <View style={styles.itemImageBox}>
                  {it.image ? (
                    <Image source={it.image} style={styles.itemImage} />
                  ) : (
                    <View style={[styles.itemImage, { backgroundColor: '#eee' }]} />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {it.name}
                  </Text>
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {it.type ? `${it.type}` : ''}{it.type && it.size ? ' • ' : ''}{it.size ? `Size: ${it.size}` : ''}
                  </Text>
                  <Text style={styles.itemMeta}>Qty: {qty}  •  Unit: ₱{unit}</Text>
                </View>
                <Text style={styles.itemTotal}>₱{lineTotal}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalValue}>₱{subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>₱{shipping}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <Text style={styles.grandValue}>₱{total}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FDF5E6',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50' },
  content: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 40 },

  metaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  metaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 14, fontWeight: '700', color: '#2c3e50' },
  metaSub: { fontSize: 12, color: '#7f8c8d', marginTop: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#fff' },

  section: { marginTop: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2c3e50', marginBottom: 8 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemImageBox: { width: 56, height: 56, borderRadius: 12, overflow: 'hidden', backgroundColor: '#eee' },
  itemImage: { width: '100%', height: '100%' },
  itemInfo: { flex: 1, marginHorizontal: 10 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#2c3e50' },
  itemMeta: { fontSize: 12, color: '#7f8c8d', marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: '#2c3e50' },

  totalsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  totalLabel: { fontSize: 14, color: '#7f8c8d' },
  totalValue: { fontSize: 14, color: '#2c3e50', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#ecf0f1', marginVertical: 6 },
  grandLabel: { fontSize: 16, fontWeight: '800', color: '#2c3e50' },
  grandValue: { fontSize: 16, fontWeight: '800', color: '#2c3e50' },
});
