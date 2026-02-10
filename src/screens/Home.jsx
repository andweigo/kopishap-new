import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
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
import AllProducts from '../components/sections/AllProducts';
import FeedbacksSection from '../components/sections/FeedbacksSection';
import { storage } from '../components/storage';
import BottomNav from '../components/ui/BottomNav';
import HomeHeader from '../components/ui/HomeHeader';
import SearchResultsModal from '../components/ui/SearchResultsModal';
import { CATEGORIES, CATEGORY_STORAGE_KEY, DEFAULT_CATEGORY, SEARCH_INTENT_KEY } from '../constants/categories';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/products';
import useCurrentUser from '../hooks/useCurrentUser';
import ProductTabNavigator from '../navigations/ProductTabNavigator';
import UserService from '../services/UserService';

const { width } = Dimensions.get('window');

const Home = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userDiscount, setUserDiscount] = useState(0);
  // State to hold the initial category. `null` means it's loading.
  const [initialCategory, setInitialCategory] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const { cartItems } = useCart();
  const { user } = useCurrentUser();
  const userName = user?.name || route?.params?.userName || '';

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

  // This effect runs ONCE on mount to load the stored category preference.
  // This ensures the Top Tab Navigator initializes with the correct tab.
  useEffect(() => {
    const loadInitialCategory = async () => {
      // 1. Check for a temporary "Search Intent" first (high priority)
      const searchIntent = await storage.getItem(SEARCH_INTENT_KEY);
      
      let startCategory = null;

      if (searchIntent && searchIntent.category && CATEGORIES.includes(searchIntent.category)) {
        startCategory = searchIntent.category;
        // Clear the intent so it only applies once
        await storage.removeItem(SEARCH_INTENT_KEY);
      } else {
        // 2. If no search intent, fall back to saved preference
        const savedCategory = await storage.getItem(CATEGORY_STORAGE_KEY);
        startCategory = savedCategory || DEFAULT_CATEGORY;
      }

      // Set the state. This will trigger a re-render and display the navigator.
      setInitialCategory(startCategory);
    };

    loadInitialCategory();
  }, []); // Empty array ensures this runs only once.

  useFocusEffect(
    useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  /**
   * Handles selecting a product from the search results modal.
   * It closes the modal, clears the search, and navigates to the Buy screen.
   */
  const handleProductSelect = (product) => {
    setIsSearchModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    navigation.navigate('Buy', { product });
  };

  const handleSuggestionPress = (product) => {
    setSearchQuery(product.name);
    setSuggestions([]);
    setSearchResults([product]);
    setIsSearchModalVisible(true);
  };

  /**
   * Handles text input in the main search bar.
   * Filters products and shows suggestions.
   */
  const handleSearch = (text) => {
    setSearchQuery(text);

    // Hide modal while typing to show suggestions
    if (isSearchModalVisible) {
      setIsSearchModalVisible(false);
    }

    if (text.length > 0) {
      const matches = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(text.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <HomeHeader
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          navigation={navigation}
          userName={userName}
        />
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.suggestionItem,
                  index === suggestions.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
          {/* Conditionally render the navigator ONLY after the initial category is loaded */}
          {initialCategory ? (
            <ProductTabNavigator
              // Pass an empty search query to prevent tabs from filtering
              searchQuery=""
              initialTab={initialCategory}
            />
          ) : (
            // Show a loading indicator while fetching the preference
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#030303ff" />
            </View>
          )}
        </View>

        {/* All products section beneath the tabs */}
        <View style={styles.allProductsWrapper}>
          <AllProducts searchQuery="" setSearchQuery={() => {}} />
        </View>

        {/* Reviews and Feedbacks Section */}
        <FeedbacksSection />
      </ScrollView>

      <SearchResultsModal
        visible={isSearchModalVisible}
        results={searchResults}
        onClose={() => setIsSearchModalVisible(false)}
        onProductSelect={handleProductSelect}
      />

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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 460, // Match the tab wrapper height
  },

  fixedHeader: {
    backgroundColor: '#FDF5E6',
    zIndex: 10,
  },

  suggestionsContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: -10,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  suggestionItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  suggestionText: {
    fontSize: 14,
    color: '#2c3e50',
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
    height: 500,

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
