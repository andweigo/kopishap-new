import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useCart } from '../context/CartContext';
import useCurrentUser from '../hooks/useCurrentUser';
import useModal from '../hooks/useModal';
import ModalButton from './buttons/ModalButton';

const DrawerMenuItem = ({ icon, label, onPress, isDanger = false }) => (
  <TouchableOpacity
    style={[styles.menuItem, isDanger && styles.dangerItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Icon
      name={icon}
      size={24}
      color={isDanger ? '#e74c3c' : '#2c3e50'}
      style={styles.icon}
    />
    <Text style={[styles.menuLabel, isDanger && styles.dangerLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const DrawerContent = ({ navigation }) => {
  const { user, logout } = useCurrentUser();
  const { clearCartState } = useCart();
  const logoutModal = useModal();
  const infoModal = useModal();

  const handleLogoutPress = () => {
    logoutModal.show();
  };

  const navigateToProfile = () => {
    navigation.navigate('Settings', {
      screen: 'SettingsScreen',
      params: { initialSection: 'myAccount' }
    });
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    console.log('DrawerContent: logout requested for user', user?.email || 'unknown');
    
    try {
      // Explicitly clear cart state before logging out
      clearCartState();
      await logout();
      // Close the modal after logout is complete.
      logoutModal.hide();
      console.log('DrawerContent: Logout completed');
      // Navigation will automatically switch to Auth stack due to state change
    } catch (error) {
      console.error('Logout error:', error);
      logoutModal.hide();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={navigateToProfile} activeOpacity={0.8}>
        <View style={styles.header}>
          <View style={styles.userAvatar}>
            <Icon name="user" size={40} color="#FFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Not logged in'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <DrawerMenuItem
          icon="home"
          label="Home"
          onPress={() => navigation.navigate('HomeStack')}
        />


        <DrawerMenuItem
          icon="heart"
          label="Favorites"
          onPress={() => navigation.navigate('Favorites')}
        />

        <DrawerMenuItem
          icon="clock"
          label="Transactions"
          onPress={() => navigation.navigate('MyOrders')}
        />


        <DrawerMenuItem
          icon="settings"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />

        {/* Divider */}
        <View style={[styles.divider, styles.menuDivider]} />

        <DrawerMenuItem
          icon="help-circle"
          label="Help & Support"
          onPress={() => infoModal.show('Help & Support', 'Contact us for assistance:\n\nPhone: 09676942911\nEmail: kapedoon@gmail.com')}
        />

        <DrawerMenuItem
          icon="users"
          label="About Us"
          onPress={() => infoModal.show('About Us', 'Welcome to Kape Doon\n\nOur Story:\nFounded in 2015, Kape Doon began as a humble coffee shop with a dream to bring world-class specialty coffee to our community. What started as a small neighborhood café has grown into a beloved destination for coffee enthusiasts.\n\nOur Mission:\nWe are passionate about crafting the perfect cup of coffee using premium quality beans sourced from sustainable farms and expert roasting techniques. Our mission is to provide an exceptional coffee experience with warm hospitality and a welcoming atmosphere for all our customers.\n\nOur Commitment:\nWe believe in the art and science of coffee. Every bean is carefully selected, every brew is expertly prepared, and every customer interaction reflects our dedication to excellence. We\'re committed to supporting local farmers, reducing our environmental impact, and creating a community space where people connect over great coffee.\n\nWhy Choose Us?\n• Ethically sourced premium coffee beans\n• Expert baristas with years of experience\n• Cozy, welcoming environment\n• Fast and reliable service\n• Special blends and seasonal offerings\n\nThank you for being part of our coffee journey!')}
        />

        {/* Divider */}
        <View style={[styles.divider, styles.menuDivider]} />

        <DrawerMenuItem
          icon="log-out"
          label="Logout"
          onPress={handleLogoutPress}
          isDanger={true}
        />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModal.visible}
        transparent
        animationType="fade"
        onRequestClose={logoutModal.hide}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={logoutModal.hide}>
              <Icon name="x" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.logoutButtons}>
              <ModalButton
                title="Cancel"
                onPress={logoutModal.hide}
                variant="secondary"
              />
              <ModalButton
                title="Logout"
                onPress={handleLogout}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Info Modal (Help & Support, About Us, Terms & Conditions) */}
      <Modal
        visible={infoModal.visible}
        transparent
        animationType="fade"
        onRequestClose={infoModal.hide}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={infoModal.hide}>
              <Icon name="x" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{infoModal.title}</Text>
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text style={styles.modalMessage}>{infoModal.message}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Kape Doon v1.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#CCC',
  },
  divider: {
    height: 1,
    backgroundColor: '#c5c5c5',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  dangerItem: {
    backgroundColor: '#FEE8E8',
  },
  icon: {
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  dangerLabel: {
    color: '#E74C3C',
  },
  menuDivider: {
    marginVertical: 4,
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#999',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: '75%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 24,
    lineHeight: 20,
  },
  logoutButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default DrawerContent;
