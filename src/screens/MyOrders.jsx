import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  BackHandler,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import BottomNav from '../components/ui/BottomNav';
import useToast from '../hooks/useToast';
import useUserOrders from '../hooks/useUserOrders';
import OrderService from '../services/OrderService';

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'processing': return '#f39c12';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };
  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}> 
      <Text style={styles.statusText}>{status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}</Text>
    </View>
  );
};

const OrderCard = ({ order, onPress }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const line = (it) => `• ${it.name}${it.size ? ` (${it.size})` : ''} x${it.quantity} — ₱${(it.price || 0) * (it.quantity || 1)}`;

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderTitle}>Order #{order.id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{formattedDate}</Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <View style={styles.orderDetails}>
        {order.items.slice(0, 3).map((it) => (
          <View key={`${it.id}_${it.size || 'NA'}`} style={styles.detailRow}>
            <Icon name="package" size={16} color="#7f8c8d" />
            <Text style={styles.detailText} numberOfLines={1}>{line(it)}</Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <View style={styles.detailRow}>
            <Icon name="more-horizontal" size={16} color="#7f8c8d" />
            <Text style={styles.detailText}>{order.items.length - 3} more item(s)...</Text>
          </View>
        )}
        <View style={[styles.detailRow, { marginTop: 4 }]}> 
          <Icon name="map-pin" size={16} color="#7f8c8d" />
          <Text style={styles.detailText} numberOfLines={1}>
            {order.deliveryAddress || 'Pickup'}
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalPrice}>₱{order.total}</Text>
          {typeof order.subtotal === 'number' && typeof order.shipping === 'number' && (
            <Text style={styles.subPrice}>Subtotal ₱{order.subtotal}  •  Shipping ₱{order.shipping}</Text>
          )}
        </View>
        <Icon name="chevron-right" size={20} color="#bdc3c7" />
      </View>
    </TouchableOpacity>
  );
};

const MyOrders = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const { userOrders, loading, loadUserOrders } = useUserOrders();
  const { showError } = useToast();

  useFocusEffect(
    React.useCallback(() => {
      loadUserOrders();
    }, [loadUserOrders])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        navigation.navigate('HomeStack');
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const handleDeleteOrder = async (orderId) => {
    const result = await OrderService.deleteOrder(orderId);
    if (result.success) {
      loadUserOrders();
    } else {
      showError(result.message || 'Failed to delete order');
    }
  };

  const handleViewOrder = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('HomeStack')} activeOpacity={0.7}>
          <Icon name="arrow-left" size={28} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Transactions</Text>
        <View style={styles.spacer} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : userOrders.length === 0 ? (
        <View style={styles.centerContent}>
          <Icon name="shopping-bag" size={80} color="#bdc3c7" />
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubText}>Start by placing your first order</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('HomeStack')}>
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => handleViewOrder(item)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FDF5E6', borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2c3e50', flex: 1, textAlign: 'center' },
  spacer: { width: 28 },
  listContent: { paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 100 },
  orderCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderTitle: { fontSize: 14, fontWeight: '700', color: '#2c3e50' },
  orderDate: { fontSize: 12, color: '#95a5a6', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600', color: '#FFF' },
  orderDetails: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ecf0f1', paddingVertical: 10, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: 12, color: '#7f8c8d', marginLeft: 8, flex: 1 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: 16, fontWeight: '700', color: '#2c3e50' },
  subPrice: { fontSize: 12, color: '#95a5a6', marginTop: 2 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { fontSize: 16, color: '#95a5a6' },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#95a5a6', marginTop: 8 },
  browseButton: { backgroundColor: '#000', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginTop: 20 },
  browseButtonText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
});

export default MyOrders;
