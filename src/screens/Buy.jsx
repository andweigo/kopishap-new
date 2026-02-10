/**
 * Buy Screen
 * Product detail and purchase screen
 * Refactored to use hooks following OOP principles
 */
import React, { useCallback } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import SizePicker from '../components/ui/SizePicker';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
import useCurrentUser from '../hooks/useCurrentUser';
import usePriceCalculator from '../hooks/usePriceCalculator';
import useProductSelection from '../hooks/useProductSelection';

const { width, height } = Dimensions.get('window');

const Buy = ({ navigation, route }) => {
  const { addItem, cartItems } = useCart();
  const { isLoggedIn } = useCurrentUser();
  const { getItemPrice, getItemTotal } = usePriceCalculator();
  
  const {
    quantity,
    selectedSize,
    quantityRef,
    sizeRef,
    SIZES,
    incrementQuantity,
    decrementQuantity,
    selectSize,
  } = useProductSelection();

  const product =
    route?.params?.product || ALL_PRODUCTS.find((p) => p.id === 'c8') || {
      name: 'Irish Coffee',
      type: 'Coffee',
      image: require('../imgs/coffee/irish.png'),
      price: { S: 150, M: 160, L: 170, XL: 180 },
    };

  const hasSizes = typeof product.price === 'object';
  const currentPrice = hasSizes ? (product.price[selectedSize] || 0) : (product.price || 0);
  const totalPrice = currentPrice * quantity;

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddToCart = useCallback(() => {
    addItem({
      ...product,
      price: currentPrice,
      size: hasSizes ? selectedSize : undefined,
      quantity: quantity,
    });
    navigation.navigate('Cart');
  }, [addItem, product, currentPrice, hasSizes, selectedSize, quantity, navigation]);

  const handleBuyNow = useCallback(() => {
    navigation.navigate('Checkout', {
      items: [{
        ...product,
        price: currentPrice,
        priceDetails: product.price,
        quantity: quantityRef.current,
        size: sizeRef.current,
      }],
      quantity: quantityRef.current,
      size: sizeRef.current,
    });
  }, [product, currentPrice, quantityRef, sizeRef, navigation]);

  const checkoutProduct = {
    ...product,
    price: currentPrice,
    priceDetails: product.price,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>

        <Image
          source={require('../imgs/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Icon name="shopping-cart" size={28} color="#000" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>

      {hasSizes && (
        <SizePicker
          value={selectedSize}
          onChange={selectSize}
          buttonSize={48}
          spacing={8}
          containerStyle={styles.sizeContainer}
        />
      )}

      <View style={styles.contentCard}>
        <View style={styles.productHeaderRow}>
          <View>
            <Text style={styles.productName}>{product.name}</Text>
            {hasSizes && <Text style={styles.sizeTagText}>Size: {sizeRef.current}</Text>}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceQtySection}>
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceAmount}>₱{currentPrice}</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.qtyControlBox}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={decrementQuantity}
                activeOpacity={0.7}
              >
                <Icon name="minus" size={16} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantityRef.current}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={incrementQuantity}
                activeOpacity={0.7}
              >
                <Icon name="plus" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₱{totalPrice}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Buy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  backButton: {
    width: 50,
  },

  cartButton: {
    width: 50,
    alignItems: 'flex-end',
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  logo: {
    width: 120,
    height: 50,
    alignSelf: 'center',
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: -100,
  },

  productImage: {
    width: width * 0.7,
    height: height * 0.35,
  },

  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
    marginTop: -80,
    gap: 12,
  },

  contentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  productHeaderRow: {
    marginBottom: 12,
  },

  sizeTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#E8E4DB',
    marginVertical: 12,
  },

  dividerVertical: {
    width: 1,
    height: 60,
    backgroundColor: '#E8E4DB',
    marginHorizontal: 12,
  },

  priceQtySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

  priceBox: {
    flex: 1,
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  priceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  qtyControlBox: {
    flex: 1,
    alignItems: 'center',
  },

  qtyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 20,
    textAlign: 'center',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  buyButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
