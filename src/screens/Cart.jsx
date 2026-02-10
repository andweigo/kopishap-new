/**
 * Cart Screen
 * Shopping cart with tabs for All, Orders, and Completed
 * Refactored to use hooks following OOP principles
 */
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import CartProductCard from '../components/cards/CartProductCard';
import FloatingBuyButton from '../components/ui/FloatingBuyButton';
import { useCart } from '../context/CartContext';
import usePriceCalculator, { getItemPrice } from '../hooks/usePriceCalculator';
import useUserOrders from '../hooks/useUserOrders';

const Tab = createMaterialTopTabNavigator();

const SelectAllHeader = ({ isSelected, onToggle, label = "Select All" }) => (
  <TouchableOpacity style={styles.selectAllContainer} onPress={onToggle} activeOpacity={0.7}>
    <Text style={styles.selectAllText}>{label}</Text>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Icon name="check" size={16} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const AllTab = ({ items, cartProps, onBuyPress, buttonLabel, isAllSelected, onSelectAll }) => {
  const selectedItems = items.filter(item => item.selected);
  
  return (
  <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 520, backgroundColor: '#FDF5E6' }} showsVerticalScrollIndicator={false}>
      {items.length > 0 && <SelectAllHeader isSelected={isAllSelected} onToggle={onSelectAll} />}
      
      {items.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Image source={require('../imgs/no_prod.jpg')} style={styles.emptyStateImage} />
          <Text style={styles.emptyStateText}>Your cart is empty.</Text>
        </View>
      ) : items.map(item => (
        <CartProductCard key={item.id} item={item} {...cartProps} />
      ))}
    </ScrollView>
    {items.length > 0 && <FloatingBuyButton items={selectedItems} buttonLabel={buttonLabel} onPress={() => onBuyPress(selectedItems)} />}
  </View>
);
}

const OrdersTab = ({ items, cartProps, onBuyPress, buttonLabel, isAllSelected, onSelectAll }) => {
  const selectedItems = items.filter(item => item.selected);
  return (
  <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 600, backgroundColor: '#FDF5E6' }} showsVerticalScrollIndicator={false}>
      {items.length > 0 && <SelectAllHeader isSelected={isAllSelected} onToggle={onSelectAll} />}

      {items.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No items pending checkout.</Text>
        </View>
      ) : items.map(item => (
        <CartProductCard key={item.id} item={item} {...cartProps} />
      ))}
    </ScrollView>
    {items.length > 0 && <FloatingBuyButton items={selectedItems} buttonLabel={buttonLabel} onPress={() => onBuyPress(selectedItems)} />}
  </View>
);
}

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'processing': return '#f39c12';
      case 'completed': return '#27ae60';
      default: return '#95a5a6';
    }
  };
  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}> 
      <Text style={styles.statusText}>{status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}</Text>
    </View>
  );
};

const OrderCard = ({ order, navigation }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString();
  const line = (it) => `• ${it.name}${it.size ? ` (${it.size})` : ''} x${it.quantity} — ₱${(it.price || 0) * (it.quantity || 1)}`;
  const totalItemsCount = order.items.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const handleBuyAgain = () => {
    const itemsToBuyAgain = order.items.map(item => ({
      ...item,
      selected: true,
      price: getItemPrice(item),
    }));
    navigation.navigate('Checkout', { items: itemsToBuyAgain, buyCount: totalItemsCount });
  };

  return (
    <View style={styles.orderCard}>
      <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { order })} activeOpacity={0.8}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>Order #{order.id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.orderDate}>{formattedDate}</Text>
          </View>
          <OrderStatusBadge status={order.status} />
        </View>

        <View style={styles.orderDetails}>
          {order.items.slice(0, 3).map(it => (
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
            <Text style={styles.detailText} numberOfLines={1}>{order.deliveryAddress || 'Pickup'}</Text>
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
      <TouchableOpacity style={styles.buyAgainButton} activeOpacity={0.8} onPress={handleBuyAgain}>
        <Icon name="shopping-cart" size={16} color="#FFF" />
        <Text style={styles.buyAgainText}>Buy Again ({totalItemsCount})</Text>
      </TouchableOpacity>
    </View>
  );
};

const CompletedTab = ({ orders, navigation }) => (
  <FlatList
    data={orders}
    keyExtractor={(it) => it.id}
    renderItem={({ item }) => <OrderCard order={item} navigation={navigation} />}
    contentContainerStyle={styles.listContent}
    showsVerticalScrollIndicator={false}
    ListEmptyComponent={
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No completed transactions yet.</Text>
      </View>
    }
  />
);

export default function KapeCart() {
  const navigation = useNavigation();
  const { cartItems, updateQuantity, updateItemSize, toggleSelection, removeItem: contextRemoveItem } = useCart();
  const { userOrders, loading: ordersLoading, loadUserOrders } = useUserOrders();
  const { calculateTotals, getItemTotal } = usePriceCalculator();
  
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const tabNames = ['All', 'Orders', 'Completed'];

  const handleDeletePress = (itemId, itemName) => {
    setItemToDelete({ id: itemId, name: itemName });
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      contextRemoveItem(itemToDelete.id);
      setDeleteConfirmationVisible(false);
      showSuccess(`${itemToDelete.name} removed from cart`);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setItemToDelete(null);
  };

  const removeItemWithConfirmation = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      handleDeletePress(itemId, item.name);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserOrders();
    }, [loadUserOrders])
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const orderedItemIds = (userOrders || []).flatMap(o => (o.items || []).map(it => it.id));
  const itemsNotCheckedOut = cartItems.filter(i => !orderedItemIds.includes(i.id));
  const ordersTabQuantity = (itemsNotCheckedOut || []).reduce((acc, item) => acc + (item.quantity || 0), 0);

  const handleBuyPress = (itemsToBuy) => {
    if (itemsToBuy.length === 0) {
      return; // Do nothing if no items selected
    }

    const itemsToCheckout = itemsToBuy.map(item => ({
      ...item,
      price: getItemPrice(item),
    }));
    navigation.navigate('Checkout', { items: itemsToCheckout, buyCount: itemsToBuy.reduce((acc, i) => acc + (i.quantity || 0), 0) });
  };

  const handleSelectAll = (items) => {
    const allSelected = items.every(item => item.selected);
    items.forEach(item => {
      if (item.selected === allSelected) {
        toggleSelection(item.id);
      }
    });
  };

  const isAllSelected = (items) => items.length > 0 && items.every(item => item.selected);

  const cartProps = { updateQuantity, updateItemSize, removeItem: removeItemWithConfirmation, toggleSelection };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={32} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kape Cart </Text>
        <TouchableOpacity style={styles.cartIconButton} onPress={() => navigation.navigate('HomeStack')}>
          <Icon name="shopping-cart" size={24} color="#000" />
          <View style={styles.plusBadge}>
            <Text style={styles.badgeText}>{totalQuantity}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#000', height: 3 },
          tabBarStyle: { backgroundColor: '#FDF5E6' },
          sceneContainerStyle: { backgroundColor: '#F7EFE3' },
        }}
        onIndexChange={setActiveTabIndex}
      >
        <Tab.Screen name="All">
          {() => (
            <AllTab 
              items={cartItems} 
              cartProps={cartProps} 
              buttonLabel="Buy Now " 
              onBuyPress={handleBuyPress} 
              isAllSelected={isAllSelected(cartItems)}
              onSelectAll={() => handleSelectAll(cartItems)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Orders">
          {() => (
            <OrdersTab 
              items={itemsNotCheckedOut} 
              cartProps={cartProps} 
              buttonLabel="Buy Now " 
              onBuyPress={handleBuyPress}
              isAllSelected={isAllSelected(itemsNotCheckedOut)}
              onSelectAll={() => handleSelectAll(itemsNotCheckedOut)}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Completed">
          {() => <CompletedTab orders={userOrders} navigation={navigation} />}
        </Tab.Screen>
      </Tab.Navigator>

      <Modal transparent visible={deleteConfirmationVisible} animationType="fade" onRequestClose={handleCancelDelete}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancelDelete}>
              <Icon name="x" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Icon name="trash-2" size={48} color="#e74c3c" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Remove Item?</Text>
            <Text style={styles.modalMessage}>Are you sure you want to remove {itemToDelete?.name} from your cart?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSecondary]} onPress={handleCancelDelete}>
                <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Keep It</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonDanger]} onPress={handleConfirmDelete}>
                <Text style={styles.modalButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, justifyContent: 'center' },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#000', textAlign: 'center', position: 'absolute'},
  cartIconButton: { marginLeft: 'auto', width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  plusBadge: { position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyStateContainer: { alignItems: 'center', padding: 20 },
  emptyStateImage: { width: 70, height: 70, marginBottom: 12 },
  emptyStateText: { fontSize: 18 },
  orderCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 12 },
  orderTitle: { fontSize: 16, fontWeight: '700' },
  orderMeta: { fontSize: 12, color: '#666' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderDate: { fontSize: 12, color: '#95a5a6', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '600', color: '#FFF' },
  orderDetails: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ecf0f1', paddingVertical: 10, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailText: { fontSize: 12, color: '#7f8c8d', marginLeft: 8, flex: 1 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: 16, fontWeight: '700', color: '#2c3e50' },
  subPrice: { fontSize: 12, color: '#95a5a6', marginTop: 2 },
  listContent: { paddingHorizontal: 15, paddingVertical: 10, paddingBottom: 630, backgroundColor: '#FDF5E6' },
  buyAgainButton: { flexDirection: 'row', backgroundColor: '#000', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
  buyAgainText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 15, right: 15, paddingHorizontal: 10, paddingVertical: 5 },
  modalIcon: { marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  modalMessage: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 25 },
  modalButtonsContainer: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#27ae60', alignItems: 'center', justifyContent: 'center' },
  modalButtonSecondary: { backgroundColor: '#bdc3c7' },
  modalButtonDanger: { backgroundColor: '#e74c3c' },
  modalButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  modalButtonSecondaryText: { color: '#2c3e50' },
  selectAllContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4, left: 225 },
  selectAllText: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginRight: 8 },
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
