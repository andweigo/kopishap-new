import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    BackHandler,
    Dimensions,
    FlatList,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ModalButton from '../components/buttons/ModalButton';
import AllProductsCard from '../components/cards/AllProductsCard';
import BottomNav from '../components/ui/BottomNav';
import { useCart } from '../context/CartContext';
import useFavorites from '../hooks/useFavorites';
import useToast from '../hooks/useToast';

const Favorites = ({ navigation }) => {
  const { favorites, loading, user, loadFavorites, removeFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState('favorites');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const { addItem } = useCart();
  const { showSuccess, showError } = useToast();

  const { width } = Dimensions.get('window');
  const ITEM_SPACING = width * 0.02;

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
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

  const handleRemoveFavorite = (productId, productName) => {
    setItemToRemove({ id: productId, name: productName });
    setShowRemoveModal(true);
  };

  const confirmRemoveFavorite = async () => {
    if (user && itemToRemove) {
      const result = await removeFavorite(itemToRemove.id);
      if (result.success) {
        setShowRemoveModal(false);
        setItemToRemove(null);
        loadFavorites();
        showSuccess(`${itemToRemove.name} removed from favorites`);
      } else {
        showError('Could not remove from favorites');
      }
    }
  };

  const cancelRemoveFavorite = () => {
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleBuyNow = (product) => {
    navigation.navigate('Buy', { product });
  };

  const renderFavoriteItem = ({ item }) => (
    <AllProductsCard
      item={item}
      height={200}
      onFavoriteRemove={() => handleRemoveFavorite(item.id, item.name)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('HomeStack')} activeOpacity={0.7}>
          <Icon name="arrow-left" size={28} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.spacer} />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.centerContent}>
          <Icon name="heart" size={80} color="#bdc3c7" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubText}>Start adding your favorite products</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('HomeStack')}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          numColumns={2}
          columnWrapperStyle={[styles.row, { paddingHorizontal: ITEM_SPACING }]}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: ITEM_SPACING }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <Modal
        visible={showRemoveModal}
        transparent
        animationType="fade"
        onRequestClose={cancelRemoveFavorite}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="heart" size={40} color="#E74C3C" />
            </View>
            <Text style={styles.modalTitle}>Remove from Favorites?</Text>
            <Text style={styles.modalMessage}>This item will be removed from your favorites.</Text>
            <View style={styles.modalButtonsRow}>
              <ModalButton
                title="Cancel"
                onPress={cancelRemoveFavorite}
                variant="secondary"
              />
              <ModalButton
                title="Continue"
                onPress={confirmRemoveFavorite}
                variant="danger"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 28,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardWrapper: {
    width: '47%',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fde2e4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#95a5a6',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
  },
  browseButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '82%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});

export default Favorites;
