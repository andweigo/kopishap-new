import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import ModalButton from '../components/buttons/ModalButton';
import BottomNav from '../components/ui/BottomNav';
import { useCart } from '../context/CartContext';
import useBackHandler from '../hooks/useBackHandler';
import useCurrentUser from '../hooks/useCurrentUser';
import useModal from '../hooks/useModal';
import useToast from '../hooks/useToast';

const getSettingsIcon = (title) => {
  const iconMap = {
    'My Account': 'user',
    'About Us': 'info',
    'Kape Delivery': 'truck',
    'Feedback': 'message-circle',
    'Help and Support': 'help-circle',
    'Logout': 'log-out',
  };
  return iconMap[title] || 'chevron-right';
};

const SettingsItem = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemContent}>
      <View style={[styles.iconContainer, title === 'Logout' && styles.logoutIconContainer]}>
        <Icon name={getSettingsIcon(title)} size={20} color={title === 'Logout' ? '#E74C3C' : '#FFF'} />
      </View>
      <Text style={[styles.menuText, title === 'Logout' && styles.logoutText]}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={20} color="#AAA" />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('user');
  const [activeSection, setActiveSection] = useState(null);
  const { user, loadCurrentUser, logout } = useCurrentUser();
  const [editedUser, setEditedUser] = useState(null);
  const { clearCartState } = useCart();
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const logoutModal = useModal();
  const infoModal = useModal();
  const { showSuccess, showError } = useToast();

  useFocusEffect(
    useCallback(() => {
      loadCurrentUser();
      const initialSection = route.params?.initialSection;
      if (initialSection) {
        setActiveSection(initialSection);
        // Clear the param so it doesn't trigger again on focus
        navigation.setParams({ initialSection: null });
      }
    }, [loadCurrentUser, route.params?.initialSection])
  );

  useBackHandler(() => {
    if (activeSection) {
      setActiveSection(null);
      return true;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    navigation.navigate('HomeStack');
    return true;
  });

  React.useEffect(() => {
    if (user) setEditedUser(user);
  }, [user]);

  const handleMyAccountPress = () => {
    setActiveSection('myAccount');
  };

  const handleFeedbackPress = () => {
    setActiveSection('feedback');
    setFeedbackMessage('');
  };

  const handleKapeDeliveryPress = () => {
    setActiveSection('delivery');
  };

  const handleAboutUsPress = () => {
    setActiveSection('aboutUs');
  };

  const handleHelpSupportPress = () => {
    infoModal.show('Help & Support', 'Contact us for assistance:\n\nPhone: 09676942911\nEmail: kapedoon@gmail.com');
  };

  const handleSaveProfile = async () => {
    if (editedUser?.contact && editedUser.contact.length > 11) {
      showError('Contact number cannot exceed 11 digits.');
      return;
    }

    const result = await (await import('../services/UserService')).default.updateUserProfile({
      name: editedUser?.name || user?.name || '',
      address: editedUser?.address || '',
      contact: editedUser?.contact || '',
    });

    if (result.success) {
      await loadCurrentUser();
      showSuccess('Profile updated successfully');
      setTimeout(() => {
        setActiveSection(null);
      }, 1500);
    } else {
      showError(result.message);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) {
      showError('Please enter your feedback');
      return;
    }

    try {
      const FeedbackService = (await import('../services/FeedbackService')).default;
      await FeedbackService.addFeedback({
        comment: feedbackMessage.trim(),
        serviceRating: 5,
        itemsRating: 5,
      });
      infoModal.show('Feedback Sent', 'We appreciate your contribution!');
      setFeedbackMessage('');
      setTimeout(() => {
        setActiveSection(null);
      }, 1500);
    } catch (error) {
      console.error('Feedback error:', error);
      showError('Failed to send feedback');
    }
  };

  const handleLogout = async () => {
    console.log('SettingsScreen: Starting logout...');
    
    try {
      // Explicitly clear cart state before logging out to ensure it persists
      clearCartState();
      await logout();
      logoutModal.hide();
      console.log('SettingsScreen: Logout completed');
    } catch (e) {
      console.error('Logout error:', e);
      logoutModal.hide();
    }
  };

  const menuItems = [
    { id: 1, title: 'My Account', onPress: handleMyAccountPress },
    { id: 2, title: 'About Us', onPress: handleAboutUsPress },
    { id: 3, title: 'Kape Delivery', onPress: handleKapeDeliveryPress },
    { id: 4, title: 'Feedback', onPress: handleFeedbackPress },
    { id: 5, title: 'Help and Support', onPress: handleHelpSupportPress },
    { id: 6, title: 'Logout', onPress: () => logoutModal.show() },
  ];

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'myAccount': return 'My Account';
      case 'feedback': return 'Feedback';
      case 'delivery': return 'Kape Delivery';
      case 'aboutUs': return 'About Kape Doon';
      case 'helpSupport': return 'Help & Support';
      default: return 'Settings';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF5E6" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => activeSection ? setActiveSection(null) : (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('HomeStack'))} activeOpacity={0.7}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getSectionTitle()}</Text>
        <View style={styles.spacer} />
      </View>

      {!activeSection ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {menuItems.map(item => (
            <SettingsItem
              key={item.id}
              title={item.title}
              onPress={item.onPress}
            />
          ))}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {activeSection === 'myAccount' && (
              <View style={styles.sectionContainer}>
              
              <View style={styles.infoCard}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser?.name || ''}
                  onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                  placeholder="Enter username"
                />
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.displayText}>{user?.email}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser?.address || ''}
                  onChangeText={text => setEditedUser({ ...editedUser, address: text })}
                  placeholder="Street, Barangay, City"
                  placeholderTextColor="#666"
                  multiline
                />
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  style={styles.input}
                  value={editedUser?.contact || ''}
                  onChangeText={text => setEditedUser({ ...editedUser, contact: text })}
                  placeholder="09XXXXXXXXX"
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeSection === 'feedback' && (
            <View style={styles.sectionContainer}>
              
              <View style={styles.infoCard}>
                <Text style={styles.feedbackInfo}>
                  Your feedback is invaluable to us! Share your thoughts, suggestions, and experiences to help us improve our services and better serve you. Every piece of feedback contributes to Kape Doon's growth and development.
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.label}>Message</Text>
                  <TextInput
                style={[styles.input, styles.feedbackInput]}
                value={feedbackMessage}
                onChangeText={setFeedbackMessage}
                placeholder="Share your feedback, suggestions, or concerns..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={6}
              />
            </View>


              <TouchableOpacity style={styles.saveButton} onPress={handleSendFeedback}>
                <Text style={styles.saveButtonText}>Send Feedback</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeSection === 'delivery' && (
            <View style={styles.sectionContainer}>
              
              <View style={styles.deliveryCard}>
                <View style={styles.deliveryFeature}>
                  <View style={styles.deliveryIcon}>
                    <Icon name="truck" size={20} color="#FFF" />
                  </View>
                  <Text style={styles.deliveryTitle}>Fast & Reliable Delivery</Text>
                  <Text style={styles.deliveryText}>We deliver fresh coffee directly to your doorstep within 30-45 minutes in selected areas.</Text>
                </View>

                <View style={styles.deliveryFeature}>
                  <View style={styles.deliveryIcon}>
                    <Icon name="map-pin" size={20} color="#FFF" />
                  </View>
                  <Text style={styles.deliveryTitle}>Wide Coverage</Text>
                  <Text style={styles.deliveryText}>Available for delivery in Metro Manila and nearby provinces. Check your area during checkout.</Text>
                </View>

                <View style={styles.deliveryFeature}>
                  <View style={styles.deliveryIcon}>
                    <Icon name="clock" size={20} color="#FFF" />
                  </View>
                  <Text style={styles.deliveryTitle}>Convenient Hours</Text>
                  <Text style={styles.deliveryText}>Order during our business hours: 6:00 AM - 10:00 PM daily for same-day or next-day delivery.</Text>
                </View>

                <View style={styles.deliveryFeature}>
                  <View style={styles.deliveryIcon}>
                    <Icon name="smile" size={20} color="#FFF" />
                  </View>
                  <Text style={styles.deliveryTitle}>Premium Quality</Text>
                  <Text style={styles.deliveryText}>We ensure your coffee arrives fresh and at the perfect temperature with our insulated packaging.</Text>
                </View>
              </View>
            </View>
          )}

          {activeSection === 'aboutUs' && (
            <View style={styles.sectionContainer}>
              
              <View style={styles.infoCard}>
                <Text style={styles.subSectionTitle}>Our Story</Text>
                <Text style={styles.aboutText}>
                  Founded in 2015, Kape Doon began as a humble coffee shop with a dream to bring world-class specialty coffee to our community. What started as a small neighborhood café has grown into a beloved destination for coffee enthusiasts.
                </Text>

                <Text style={styles.subSectionTitle}>Our Mission</Text>
                <Text style={styles.aboutText}>
                  We are passionate about crafting the perfect cup of coffee using premium quality beans sourced from sustainable farms and expert roasting techniques. Our mission is to provide an exceptional coffee experience with warm hospitality and a welcoming atmosphere for all our customers.
                </Text>

                <Text style={styles.subSectionTitle}>Our Commitment</Text>
                <Text style={styles.aboutText}>
                  We believe in the art and science of coffee. Every bean is carefully selected, every brew is expertly prepared, and every customer interaction reflects our dedication to excellence. We're committed to supporting local farmers, reducing our environmental impact, and creating a community space where people connect over great coffee.
                </Text>

                <Text style={styles.subSectionTitle}>Why Choose Us?</Text>
                <Text style={styles.aboutText}>
                  • Ethically sourced premium coffee beans{"\n"}
                  • Expert baristas with years of experience{"\n"}
                  • Cozy, welcoming environment{"\n"}
                  • Fast and reliable service{"\n"}
                  • Special blends and seasonal offerings{"\n\n"}
                  Thank you for being part of our coffee journey!
                </Text>
              </View>
            </View>
          )}

          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <Modal
        visible={infoModal.visible}
        transparent
        animationType="fade"
        onRequestClose={infoModal.hide}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{infoModal.title}</Text>
            <Text style={styles.modalMessage}>{infoModal.message}</Text>
            <ModalButton
              title="OK"
              onPress={infoModal.hide}
              style={{ width: '100%', flex: 0 }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModal.visible}
        transparent
        animationType="fade"
        onRequestClose={logoutModal.hide}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
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

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF5E6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#000' },
  spacer: { width: 28 },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 16 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 12, marginVertical: 4, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuItemContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoutIconContainer: { backgroundColor: '#FFE8E8' },
  menuText: { fontSize: 14, color: '#333', fontWeight: '500' },
  logoutText: { color: '#E74C3C' },
  
  // Section Styles
  sectionContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 16 },
  subSectionTitle: { fontSize: 15, fontWeight: '700', color: '#000', marginTop: 14, marginBottom: 8 },
  
  // Info Card Styles
  infoCard: { backgroundColor: '#F9F9F9', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  label: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#E8E8E8', padding: 10, borderRadius: 8, fontSize: 14, color: '#333', backgroundColor: '#FFF' },
  displayText: { fontSize: 13, color: '#555', paddingVertical: 8, fontWeight: '500' },
  feedbackInput: { minHeight: 100, textAlignVertical: 'top' },
  feedbackInfo: { fontSize: 13, color: '#666', lineHeight: 20 },
  
  // About Text
  aboutText: { fontSize: 13, color: '#666', lineHeight: 20 },
  
  // Contact
  contactRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  contactText: { fontSize: 13, color: '#333', marginLeft: 12, fontWeight: '500' },
  
  // Delivery Card
  deliveryCard: { gap: 10 },
  deliveryFeature: { backgroundColor: '#F9F9F9', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#F0F0F0' },
  deliveryIcon: { marginBottom: 8, width: 32, height: 32, borderRadius: 6, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  deliveryTitle: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  deliveryText: { fontSize: 12, color: '#666', lineHeight: 18 },
  
  // Buttons
  saveButton: { backgroundColor: '#000', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginVertical: 16 },
  saveButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600', letterSpacing: 0.2 },
  
  // Modal Styles
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { width: '100%', backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#000' },
  modalMessage: { fontSize: 14, color: '#666', textAlign: 'left', marginBottom: 24, lineHeight: 20 },
  logoutButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, width: '100%' },
});
