/**
 * Checkout Screen
 * Order review and checkout process
 * Refactored to use hooks following OOP principles
 */
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import useCurrentUser from '../hooks/useCurrentUser';
import useModal from '../hooks/useModal';
import usePriceCalculator, { getItemPrice } from '../hooks/usePriceCalculator';
import useToast from '../hooks/useToast';
import OrderService from '../services/OrderService';
import UserService from '../services/UserService';

export default function Checkout() {
  const navigation = useNavigation();
  const route = useRoute();

  const { items = [] } = route.params || {};
  const infoModal = useModal();
  const { showSuccess, showError, showInfo } = useToast();

  const { user, loadCurrentUser, isLoggedIn } = useCurrentUser();
  const { calculateTotals, calculateShipping } = usePriceCalculator();
  
  const [useProfileAddress, setUseProfileAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [cashlessAmount, setCashlessAmount] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [userDiscount, setUserDiscount] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountAlreadyUsed, setDiscountAlreadyUsed] = useState(false);

  // Calculate totals using the hook
  const { subtotal, shipping, grandTotal } = calculateTotals(items, deliveryMethod);

  // Calculate discount amount
  const discountAmount = applyDiscount && userDiscount > 0 
    ? Math.round((grandTotal * userDiscount) / 100)
    : 0;
  
  const finalGrandTotal = grandTotal - discountAmount;

  useFocusEffect(
    useCallback(() => {
      const loadDiscount = async () => {
        // Get the unused discount amount for applying
        const discount = await UserService.getUserDiscount();
        setUserDiscount(discount || 0);
        
        // Get the actual discount value (even if used) for display
        const value = await UserService.getDiscountValue();
        setDiscountValue(value || 0);
        
        // Check if discount was already used
        const alreadyUsed = await UserService.isDiscountAlreadyUsed();
        setDiscountAlreadyUsed(alreadyUsed);
        
        // Reset applyDiscount if discount was already used
        if (alreadyUsed) {
          setApplyDiscount(false);
        }
      };
      loadCurrentUser();
      loadDiscount();
    }, [loadCurrentUser])
  );

  // Handle Android hardware back button (and swipe gesture)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (infoModal.visible) return false;
        infoModal.show('Almost There!', "Just one click to order, then you're all set!");
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [infoModal.visible])
  );

  const handleCheckout = async () => {
    if (isSaving) return false;
    try {
      setIsSaving(true);
      const currentUser = user || (await loadCurrentUser());
      if (!currentUser) {
        infoModal.hide();
        return false;
      }

      const effectiveAddress = getEffectiveAddress();
      const effectiveContact = getEffectiveContact();

      // Validate delivery
      if (deliveryMethod === 'delivery') {
        if (!effectiveAddress?.trim() || !effectiveContact?.trim()) {
          setIsSaving(false);
          return false;
        }
      }

      // Normalize items for storage
      const normalizedItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: getItemPrice(item),
        size: item.size || null,
        quantity: item.quantity || 1,
        type: item.type || null,
      }));

      const paymentNote = deliveryMethod === 'delivery' 
        ? `Payment: ${paymentMethod === 'cashless' ? 'Cashless' : 'COD'}` 
        : 'Payment: Counter';

      const result = await OrderService.saveOrder({
        userId: currentUser.id,
        items: normalizedItems,
        subtotal,
        shipping,
        total: finalGrandTotal,
        discountApplied: applyDiscount,
        discountPercentage: applyDiscount ? userDiscount : 0,
        discountAmount: discountAmount,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? effectiveAddress.trim() : null,
        deliveryLandmark: deliveryMethod === 'delivery' ? (landmark.trim() || null) : null,
        contactNumber: deliveryMethod === 'delivery' ? effectiveContact.trim() : null,
        notes: paymentNote,
        status: deliveryMethod === 'delivery' ? 'processing' : 'completed',
      });
      
      // Mark discount as used if it was applied
      if (applyDiscount && userDiscount > 0) {
        await UserService.markDiscountAsUsed();
      }
      
      console.log('Order saved:', result);
      return true;
    } catch (e) {
      console.error('Checkout save error', e);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getEffectiveAddress = () => {
    if (useProfileAddress && user?.address) {
      return user.address;
    }
    return address;
  };

  const getEffectiveContact = () => {
    if (useProfileAddress && user?.contact) {
      return user.contact;
    }
    return contactNumber;
  };

  const handleApplyDiscountToggle = () => {
    if (discountAlreadyUsed) {
      showInfo('Your promo code has already been used. Keep updated for more exciting offers!');
      return;
    }
    setApplyDiscount(!applyDiscount);
  };

  const processCheckout = async () => {
    const success = await handleCheckout();
    if (success) {
      const message = deliveryMethod === 'delivery' 
        ? 'Your delivery order has been placed and will be processed.' 
        : 'Your order has been listed. Please proceed to the counter.';
      
      showSuccess(message);
      navigation.navigate('MyOrders');
    }
  };

  const handleCheckoutPress = async () => {
    const effectiveAddress = getEffectiveAddress();
    const effectiveContact = getEffectiveContact();
    
    if (deliveryMethod === 'delivery') {
      if (!effectiveAddress?.trim() || !effectiveContact?.trim()) {
        showError('Please provide both delivery address and contact number to complete your order.');
        return;
      }

      if (!/^\d{11}$/.test(effectiveContact.trim())) {
        showError('Contact number must be exactly 11 digits.');
        return;
      }

      if (paymentMethod === 'cashless') {
        setPaymentModalVisible(true);
        return;
      }
    }
    
    await processCheckout();
  };

  const handleCashlessSubmit = () => {
    const amount = parseFloat(cashlessAmount);
    if (!cashlessAmount || isNaN(amount)) {
      setPaymentError('Please enter a valid amount');
      return;
    }
    if (amount !== finalGrandTotal) {
      setPaymentError(`Payment must be exactly ₱${finalGrandTotal}`);
      return;
    }
    setPaymentModalVisible(false);
    processCheckout();
  };

  const renderItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <View key={item?.id || Math.random()} style={styles.card}>
        <View style={[styles.imageContainer, { backgroundColor: '#f8f8f8' }]}>
          {item.image ? <Image source={item.image} style={styles.productImage} /> : (
            <View style={styles.imagePlaceholder}><Text style={styles.coffeeEmoji}>☕</Text></View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name || 'Unknown Product'}</Text>
          {item.type && <Text style={styles.itemType}>{item.type}</Text>}
          <Text style={styles.itemPrice}>₱{getItemPrice(item)}</Text>
          
          <View style={styles.controlsRow}>
            {item.size && <Text style={styles.sizeLabel}>Size: {item.size}</Text>}
            {item.size && <Text style={styles.quantityLabel}>Qty: {item.quantity || 1}</Text>}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => infoModal.show('Almost There!', "Just one click to order, then you're all set!")}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout List</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((item) => renderItem({ item }))}

        {/* Delivery method selection */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionLabel}>Delivery Method</Text>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[styles.optionButton, deliveryMethod === 'pickup' && styles.optionSelected]}
              onPress={() => setDeliveryMethod('pickup')}
            >
              <Text style={[styles.optionText, deliveryMethod === 'pickup' && styles.optionTextSelected]}>Pickup (No fee)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, deliveryMethod === 'delivery' && styles.optionSelected]}
              onPress={() => setDeliveryMethod('delivery')}
            >
              <Text style={[styles.optionText, deliveryMethod === 'delivery' && styles.optionTextSelected]}>Delivery (₱50)</Text>
            </TouchableOpacity>
          </View>

          {deliveryMethod === 'pickup' && (
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>Note: You may proceed to pay at the counter.</Text>
            </View>
          )}

          {deliveryMethod === 'delivery' && (
            <>
              <View style={styles.deliveryInputs}>
              {user?.address && user?.contact && (
                <>
                  <TouchableOpacity 
                    style={[styles.addressOption, useProfileAddress && styles.addressOptionSelected]}
                    onPress={() => setUseProfileAddress(!useProfileAddress)}
                  >
                    <View style={styles.checkboxStyle}>
                      {useProfileAddress && <View style={styles.checkboxInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.addressLabel}>Use My Saved Address</Text>
                      <Text style={styles.addressPreview}>{user.address}</Text>
                      <Text style={styles.addressPreview}>{user.contact}</Text>
                    </View>
                  </TouchableOpacity>
                  {!useProfileAddress && <Text style={styles.dividerText}>OR</Text>}
                </>
              )}

              {!useProfileAddress && (
                <>
                  <Text style={styles.inputLabel}>Delivery Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Street, Barangay, City"
                    placeholderTextColor="#95a5a6"
                    value={address}
                    onChangeText={setAddress}
                  />

                  <Text style={[styles.inputLabel, { marginTop: 12 }]}>Landmark (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Near the mall / beside the bakery"
                    placeholderTextColor="#95a5a6"
                    value={landmark}
                    onChangeText={setLandmark}
                  />

                  <Text style={[styles.inputLabel, { marginTop: 12 }]}>Contact Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="09XXXXXXXXX"
                    placeholderTextColor="#95a5a6"
                    keyboardType="phone-pad"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                  />
                </>
              )}
            </View>

              <View style={styles.deliveryInputs}>
                <Text style={styles.inputLabel}>Payment Method</Text>
                <View style={styles.paymentOptions}>
                  <TouchableOpacity 
                    style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]}
                    onPress={() => setPaymentMethod('cod')}
                  >
                    <View style={styles.radioCircle}>
                      {paymentMethod === 'cod' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.paymentText}>Cash on Delivery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.paymentOption, paymentMethod === 'cashless' && styles.paymentOptionSelected]}
                    onPress={() => setPaymentMethod('cashless')}
                  >
                    <View style={styles.radioCircle}>
                      {paymentMethod === 'cashless' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.paymentText}>Cashless (Gcash/Maya)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Discount Section */}
        {(discountValue > 0 || discountAlreadyUsed) && (
          <View style={styles.discountSection}>
            <TouchableOpacity 
              style={[styles.discountOption, applyDiscount && styles.discountOptionSelected, discountAlreadyUsed && styles.discountDisabled]}
              onPress={handleApplyDiscountToggle}
              disabled={discountAlreadyUsed}
            >
              <View style={styles.discountCheckbox}>
                {applyDiscount && <View style={styles.discountCheckboxInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.discountLabel}>Apply My Promo Code</Text>
                <Text style={[styles.discountBadgeText, discountAlreadyUsed && styles.discountUsedText]}>
                  {discountAlreadyUsed ? 'Already used on your first order' : `${discountValue}% OFF on this order`}
                </Text>
              </View>
              {applyDiscount && (
                <View style={styles.savingsView}>
                  <Text style={styles.savingsText}>Save ₱{discountAmount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₱{subtotal}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Fee</Text>
            <Text style={styles.priceValue}>{shipping === 0 ? 'FREE' : `₱${shipping}`}</Text>
          </View>

          {applyDiscount && userDiscount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, styles.discountPriceLabel]}>Discount ({userDiscount}%)</Text>
              <Text style={[styles.priceValue, styles.discountPriceValue]}>-₱{discountAmount}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₱{finalGrandTotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton} activeOpacity={0.9} onPress={handleCheckoutPress}>
          <Text style={styles.floatingButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={infoModal.visible} animationType="fade" onRequestClose={infoModal.hide}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={infoModal.hide}>
              <Icon name="x" size={24} color="#2c3e50" />
            </TouchableOpacity>
            
            {infoModal.title === 'Almost There!' ? (
              <>
                <Icon name="info" size={48} color="#f39c12" style={styles.modalIcon} />
                <Text style={styles.modalTitle}>{infoModal.title}</Text>
                <Text style={styles.modalMessage}>{infoModal.message}</Text>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={[styles.modalButton, styles.modalButtonSecondary, { flex: 1 }]} onPress={() => { infoModal.hide(); navigation.canGoBack() ? navigation.goBack() : navigation.navigate('HomeStack'); }}>
                    <Text style={[styles.modalButtonText, styles.modalButtonSecondaryText]}>Later</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, { flex: 1 }]} onPress={infoModal.hide}>
                    <Text style={styles.modalButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Icon name="alert-circle" size={48} color="#e74c3c" style={styles.modalIcon} />
                <Text style={styles.modalTitle}>{infoModal.title}</Text>
                <Text style={styles.modalMessage}>{infoModal.message}</Text>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonError]} onPress={infoModal.hide}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Cashless Payment Modal */}
      <Modal transparent visible={paymentModalVisible} animationType="slide" onRequestClose={() => setPaymentModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPaymentModalVisible(false)}>
              <Icon name="x" size={24} color="#2c3e50" />
            </TouchableOpacity>
            
            <Icon name="credit-card" size={48} color="#3498db" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Cashless Payment</Text>
            <Text style={styles.modalMessage}>Please enter the amount you wish to pay. Total due: ₱{finalGrandTotal}</Text>
            
            <TextInput
              style={[styles.paymentInput, paymentError && styles.inputError]}
              placeholder="Enter Amount"
              placeholderTextColor="#95a5a6"
              keyboardType="numeric"
              value={cashlessAmount}
              onChangeText={(text) => {
                setCashlessAmount(text);
                setPaymentError('');
              }}
            />
            {paymentError ? <Text style={styles.paymentErrorText}>{paymentError}</Text> : null}
            
            <TouchableOpacity style={styles.modalButton} onPress={handleCashlessSubmit}>
              <Text style={styles.modalButtonText}>Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: {},
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#000', textAlign: 'center', flex: 1 },
  headerSpacer: { width: 24 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 180 },
  
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
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
    alignItems: 'center',
  },

  coffeeEmoji: { fontSize: 40 },
  productImage: { width: 70, height: 70, resizeMode: 'contain' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 4 },
  itemType: { fontSize: 12, color: '#7f8c8d', marginBottom: 3 },
  itemPrice: { fontSize: 14, color: '#27ae60', fontWeight: '700', marginBottom: 6 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sizeLabel: { fontSize: 12, color: '#7f8c8d', fontWeight: '500' },
  quantityLabel: { fontSize: 12, color: '#7f8c8d', fontWeight: '500', backgroundColor: '#f8f8f8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  deliverySection: { marginTop: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#2c3e50', marginBottom: 12 },
  deliveryOptions: { flexDirection: 'row', gap: 12 },
  optionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E8E4DB', alignItems: 'center' },
  optionSelected: { backgroundColor: '#000', borderColor: '#000' },
  optionText: { fontSize: 14, fontWeight: '600', color: '#666' },
  optionTextSelected: { color: '#FFF' },
  
  deliveryInputs: { marginTop: 16, backgroundColor: '#FFF', borderRadius: 12, padding: 16 },
  addressOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E8E4DB' },
  addressOptionSelected: { backgroundColor: '#E8F5E9', borderColor: '#27ae60' },
  checkboxStyle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E8E4DB', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#27ae60' },
  addressLabel: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  addressPreview: { fontSize: 12, color: '#666', marginTop: 2 },
  dividerText: { textAlign: 'center', color: '#999', marginVertical: 12 },
  
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#2c3e50', marginBottom: 6 },
  input: { backgroundColor: '#F8F8F8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#2c3e50' },

  noteContainer: { marginTop: 12, padding: 12, backgroundColor: '#FFF3CD', borderRadius: 8, borderWidth: 1, borderColor: '#FFEeba' },
  noteText: { fontSize: 13, color: '#856404', textAlign: 'center' },

  paymentOptions: { flexDirection: 'column', gap: 10, marginTop: 8 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E8E4DB', backgroundColor: '#F8F8F8' },
  paymentOptionSelected: { backgroundColor: '#E8F5E9', borderColor: '#27ae60' },
  paymentText: { fontSize: 14, fontWeight: '500', color: '#2c3e50' },
  radioCircle: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#27ae60', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioInner: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#27ae60' },
  paymentInput: { width: '100%', backgroundColor: '#F8F8F8', borderRadius: 10, padding: 12, fontSize: 18, textAlign: 'center', borderWidth: 1, borderColor: '#E8E4DB', marginBottom: 20, color: '#000' },
  inputError: { borderColor: '#e74c3c' },
  paymentErrorText: { color: '#e74c3c', fontSize: 14, marginBottom: 20, textAlign: 'center', fontWeight: '500' },

  priceSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 },
  priceLabel: { fontSize: 14, color: '#7f8c8d', fontWeight: '500' },
  priceValue: { fontSize: 14, color: '#2c3e50', fontWeight: '600', textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#ecf0f1', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#2c3e50' },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#27ae60', textAlign: 'right' },

  discountSection: { marginTop: 20, marginBottom: 12 },
  discountOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E8E4DB' },
  discountOptionSelected: { backgroundColor: '#FFF3CD', borderColor: '#FFD700' },
  discountDisabled: { opacity: 0.6 },
  discountCheckbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#FFD700', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  discountCheckboxInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFD700' },
  discountLabel: { fontSize: 14, fontWeight: '600', color: '#2c3e50' },
  discountBadgeText: { fontSize: 12, color: '#27ae60', fontWeight: '600', marginTop: 2 },
  discountUsedText: { color: '#e74c3c' },
  savingsView: { paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#E8E4DB' },
  savingsText: { fontSize: 13, fontWeight: '700', color: '#27ae60' },

  discountPriceLabel: { color: '#27ae60' },
  discountPriceValue: { color: '#27ae60' },

  floatingButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FDF5E6' },
  floatingButton: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  floatingButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 15, right: 15, paddingHorizontal: 10, paddingVertical: 5 },
  modalIcon: { marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50' },
  modalMessage: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 25 },
  modalButtonsContainer: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { width: '100%', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#27ae60', alignItems: 'center', justifyContent: 'center' },
  modalButtonSecondary: { backgroundColor: '#bdc3c7' },
  modalButtonError: { backgroundColor: '#e74c3c' },
  modalButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  modalButtonSecondaryText: { color: '#2c3e50' },
});
