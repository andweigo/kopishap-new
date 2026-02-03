import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
import SizePicker from '../components/ui/SizePicker';

const { width, height } = Dimensions.get('window');

const Buy = ({ navigation, route }) => {
  const { addItem, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('L');

  const quantityRef = useRef(quantity);
  const sizeRef = useRef(selectedSize);


  const product =
    route?.params?.product || ALL_PRODUCTS.find((p) => p.id === 'c8') || {
      name: 'Irish Coffee',
      type: 'Coffee',
      image: require('../imgs/coffee/irish.png'),
      price: { S: 150, M: 160, L: 170, XL: 180 },
    };

  const hasSizes = typeof product.price === 'object';

  const getPrice = (size) => {
    return hasSizes ? product.price[size] : product.price;
  };

  const incrementQuantity = () => {
    setQuantity((prev) => {
      const newQty = prev + 1;
      quantityRef.current = newQty;
      return newQty;
    });
  };

  const decrementQuantity = () => {
    setQuantity((prev) => {
      const newQty = prev > 1 ? prev - 1 : 1;
      quantityRef.current = newQty;
      return newQty;
    });
  };

  const selectSize = (size) => {
    setSelectedSize(size);
    sizeRef.current = size;
  };

  const currentPrice = getPrice(selectedSize);
  const checkoutProduct = {
    ...product,
    price: currentPrice, 
    priceDetails: product.price,
  };

  const handleAddToCart = () => {
    addItem({
      ...product,
      price: currentPrice,
      size: hasSizes ? selectedSize : undefined,
      quantity: quantity,
    });
    navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
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
          <SizePicker value={selectedSize} onChange={selectSize} buttonSize={48} spacing={8} containerStyle={styles.sizeContainer} />
      )}


      <View style={styles.productInfoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.selectedSize}>{hasSizes ? sizeRef.current : ''}</Text>
      </View>

      <View style={styles.quantityUnderSizeContainer}>
        <Text style={styles.quantityLabel}>
          {quantityRef.current}X
        </Text>
        <Text style={styles.priceLabel}>₱{currentPrice}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={decrementQuantity}
        >
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>

        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>
            {quantityRef.current}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={incrementQuantity}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.buyButton}
        onPress={() =>
          navigation.navigate('Checkout', {
            items: [{ ...checkoutProduct, quantity: quantityRef.current, size: sizeRef.current }],
            quantity: quantityRef.current,
            size: sizeRef.current,
          })
        }
      >
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

  productInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },

  productName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
  },

  selectedSize: {
    fontSize: 15,
    fontWeight: '500',
    color: '#B8956A',
  },

  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 50,
    marginTop: -100,
    gap: 15,
  },

  sizeButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#E8E4DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -180,
  },

  sizeButtonActive: {
    backgroundColor: '#B8956A',
  },

  sizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },

  sizeTextActive: {
    color: '#000',
  },

  quantityUnderSizeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: -20,
    left: 140,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: -20,
    right: 140,
  },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 20,
  },

  quantityButton: {
    width: 130,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#E8E4DD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    fontSize: 30,
    fontWeight: '300',
    color: '#000',
  },

  quantityDisplay: {
    width: 100,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#B8956A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },

  buyButton: {
    marginHorizontal: 60,
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 30,
  },

  buyButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
