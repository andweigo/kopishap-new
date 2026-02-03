import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  StatusBar,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CoffeeTab from '../components/tabs/CoffeeTab';
import LemonadeTab from '../components/tabs/LemonadeTab';
import PastriesTab from '../components/tabs/PastriesTab';
import SpecialTab from '../components/tabs/SpecialTabs';
import MerchTab from '../components/tabs/MerchTab';
import AllProducts, { ALL_PRODUCTS } from '../components/sections/AllProducts';
import useAutoHideBottomNav from '../hooks/useAutoHideBottomNav';
import { useCart } from '../context/CartContext';
import BottomNav from '../components/ui/BottomNav';

const { width } = Dimensions.get('window');
const ITEM_SPACING = width * 0.05;

const CATEGORIES = ['Coffee', 'Lemonade', 'Pastries', 'Specials', 'Merchs'];

const CategoryPill = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.categoryPill, isActive && styles.categoryPillActive]}
  >
    <Text style={isActive ? styles.categoryTextActive : styles.categoryText}>{title}</Text>
  </TouchableOpacity>
);

const PlaceholderCard = ({ title }) => (
  <View style={styles.placeholderCard}>
    <Image source={require('../imgs/coffee/americano.png')} style={styles.productImage} />
    <Text style={styles.placeholderText}>No tab implemented for "{title}" yet.</Text>
  </View>
);

const HomeHeader = ({ activeCategory, setActiveCategory, renderTabContent, searchQuery, setSearchQuery, navigation, userName }) => (
  <View>
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>
          {userName ? `Welcome, ${userName}!` : 'Welcome!'}
        </Text>
        <Text style={styles.subHeading}>Let's start an order</Text>
      </View>
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon name="user" size={30} color="#FFF" />
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
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearButton}>
          <Icon name="x" size={18} color="#888" />
        </TouchableOpacity>
      ) : null}
    </View>

    <View style={styles.featContainer}>
      <Text style={styles.featText}>Featured</Text>
    </View>

    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <CategoryPill
          title={item}
          isActive={item === activeCategory}
          onPress={() => setActiveCategory(item)}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryList}
      contentContainerStyle={styles.categoryListContainer}
    />

    <View style={styles.tabContent}>{renderTabContent()}</View>

    <View style={styles.extraSpace} />
  </View>
);

const Home = ({ route }) => {
  const { userName } = route.params || {}; 
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [showAllCoffee, setShowAllCoffee] = useState(false);
  const [showAllLemonade, setShowAllLemonade] = useState(false);
  const [showAllPastries, setShowAllPastries] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { visible, onScroll } = useAutoHideBottomNav();
  const [activeTab, setActiveTab] = useState('home');
  const { cartItems } = useCart();
  const navigation = useNavigation();
  const anim = useRef(new Animated.Value(0));

  useFocusEffect(
    useCallback(() => {
      setActiveTab('home');
    }, [])
  );

  useEffect(() => {
    Animated.timing(anim.current, {
      toValue: visible ? 0 : 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleSeeAllCoffee = () => setShowAllCoffee(true);
  const handleSeeAllLemonade = () => setShowAllLemonade(true);
  const handleSeeAllPastries = () => setShowAllPastries(true);

  const query = (searchQuery || '').trim().toLowerCase();
  const globalHasMatches = query ? ALL_PRODUCTS.some(p => p.name.toLowerCase().includes(query)) : true;

  const renderTabContent = () => {
    const suppressEmpty = !!(query && !globalHasMatches);
    switch (activeCategory) {
      case 'Coffee':
        return <CoffeeTab showAll={showAllCoffee} onSeeAll={handleSeeAllCoffee} searchQuery={searchQuery} suppressEmpty={suppressEmpty} />;
      case 'Lemonade':
        return <LemonadeTab showAll={showAllLemonade} onSeeAll={handleSeeAllLemonade} searchQuery={searchQuery} suppressEmpty={suppressEmpty} />;
      case 'Pastries':
        return <PastriesTab showAll={showAllPastries} onSeeAll={handleSeeAllPastries} searchQuery={searchQuery} suppressEmpty={suppressEmpty} />;
      case 'Specials':
        return <SpecialTab searchQuery={searchQuery} suppressEmpty={suppressEmpty} />;
      case 'Merchs':
        return <MerchTab searchQuery={searchQuery} suppressEmpty={suppressEmpty} />;
      default:
        return <PlaceholderCard title={activeCategory} />;
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />

      <FlatList
        data={[]}
        ListHeaderComponent={
          <HomeHeader
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            renderTabContent={renderTabContent}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            navigation={navigation}
            userName={userName} 
          />
        }
        ListFooterComponent={<AllProducts onScroll={onScroll} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        style={styles.scrollView}
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} cartItemCount={cartItemCount} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: '#FDF5E6' },
  scrollView: { flex: 1, paddingTop: 10 },
  scrollContentContainer: { paddingBottom: 120 },

  featContainer: { paddingHorizontal: 30, paddingBottom: 10 },
  featText: { fontWeight: 'bold', fontSize: 17, color: '#000' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  greeting: { fontSize: 18, marginTop: 15, color: '#000', fontWeight: '400' },
  subHeading: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  profileIconContainer: { width: 44, height: 44, marginTop: 15, borderRadius: 22, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },

  searchBar: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 15, backgroundColor: '#EBEBEB', marginHorizontal: 20, marginBottom: 10 },
  searchIcon: { paddingHorizontal: 10 },
  searchTextInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#000' },
  searchClearButton: { paddingHorizontal: 12, paddingVertical: 8 },

  categoryList: { marginBottom: 30, height: 40 },
  categoryListContainer: { paddingHorizontal: 20 },
  categoryPill: { paddingHorizontal: 25, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EBEBEB', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  categoryPillActive: { backgroundColor: '#000' },
  categoryText: { color: '#000', fontWeight: '500' },
  categoryTextActive: { color: '#FFF', fontWeight: '500' },

  tabContent: { paddingHorizontal: ITEM_SPACING },

  placeholderCard: { width: width * 0.8, height: width * 1.1, borderRadius: 30, padding: 30, marginRight: ITEM_SPACING, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EBEBEB', alignSelf: 'center' },
  placeholderText: { fontSize: 18, color: '#333', marginTop: 10 },
  productImage: { width: '100%', height: '60%', resizeMode: 'contain' },

  extraSpace: { height: 100 },
});

export default Home;
