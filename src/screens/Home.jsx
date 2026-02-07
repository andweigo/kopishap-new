import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
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
import AllProducts from '../components/sections/AllProducts';
import BottomNav from '../components/ui/BottomNav';
import FeedbacksSection from '../components/ui/FeedbacksSection';
import { useCart } from '../context/CartContext';
import useCurrentUser from '../hooks/useCurrentUser';
import useUserPreferences from '../hooks/useUserPreferences';
import ProductTabNavigator from '../navigations/ProductTabNavigator';
import UserService from '../services/UserService';

const { width } = Dimensions.get('window');

/**
 * HomeHeader - Header component with search, menu, and navigation
 * Displays greeting, search bar, and navigation buttons
 */
const HomeHeader = ({ searchQuery, setSearchQuery, navigation, userName }) => (
  <View>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
        <Icon name="menu" size={28} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.greeting}>
          {userName ? `Welcome, ${userName}!` : 'Welcome!'}
        </Text>
        <Text style={styles.subHeading}>Let's start an order</Text>
      </View>
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.7}
      >
        <Image source={require('../imgs/logo.png')} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="contain" />
      </TouchableOpacity>
    </View>

    <View style={styles.searchBar}>
      <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        placeholder="Search products"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchTextInput}
        returnKeyType="search"
        placeholderTextColor="#95a5a6"
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearButton}>
          <Icon name="x" size={18} color="#888" />
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const Home = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [userDiscount, setUserDiscount] = useState(0);
  const { cartItems } = useCart();
  const { user } = useCurrentUser();
  const userName = user?.name || route?.params?.userName || '';
  
  // Use hook for user preferences
  const { userPreferences, loadPreferences } = useUserPreferences();
  const preferredCategory = userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;

  // Generate and show discount on initial mount
  useEffect(() => {
    const generateDiscount = async () => {
      const discount = await UserService.generateAndStoreDiscount();
      if (discount > 0) {
        setUserDiscount(discount);
        setShowWelcomeModal(true);
      }
    };
    generateDiscount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPreferences();
      setActiveTab('home');
    }, [loadPreferences])
  );

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <HomeHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          navigation={navigation}
          userName={userName}
        />
      </View>

      {/* Scrollable content container */}
      <ScrollView 
        style={styles.scrollViewContainer}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Categories heading */}
        <View style={styles.featContainer}>
          <Text style={styles.featText}>Categories</Text>
        </View>

        {/* Top Tab Navigator for Product Categories */}
        <View style={styles.tabWrapper}>
          <ProductTabNavigator searchQuery={searchQuery} initialTab={preferredCategory} />
        </View>

        {/* All products section beneath the tabs */}
        <View style={styles.allProductsWrapper}>
          <AllProducts searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </View>

        {/* Reviews and Feedbacks Section */}
        <FeedbacksSection />
      </ScrollView>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Welcome Modal with Discount */}
      <Modal
        visible={showWelcomeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWelcomeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Icon name="gift" size={48} color="#000000" />
            </View>
            
            <Text style={styles.modalTitle}>Welcome to Kape Doon!</Text>
            
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{userDiscount}% OFF</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              We're thrilled to have you here! Enjoy a special discount on your first order. Explore our selection of specialty drinks, delicious pastries, and more.
            </Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWelcomeModal(false)}
            >
              <Text style={styles.modalButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },

  fixedHeader: {
    backgroundColor: '#FDF5E6',
    zIndex: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#030303ff',
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },

  greeting: {
    fontSize: 13,
    color: '#ecf0f1',
    fontWeight: '400',
    marginBottom: 2,
  },

  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchTextInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#2c3e50',
  },

  searchClearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  featContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  featText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2c3e50',
  },

  scrollViewContainer: {
    flex: 1,
  },

  tabWrapper: {
    height: 460,

  },

  allProductsWrapper: {
    minHeight: 500,
    marginTop: 20,
    marginBottom: -80,
    paddingBottom: 100,
  },

  // Welcome Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 28,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
  },

  modalHeader: {
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },

  discountBadge: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },

  discountText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },

  modalMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '400',
  },

  modalButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },

  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Home;
