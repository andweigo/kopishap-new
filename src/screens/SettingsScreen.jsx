import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/ui/BottomNav';
import useSettingsModals from '../hooks/useSettingsModal';

const SettingsItem = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.menuText}>{title}</Text>
    <Icon name="chevron-right" size={24} color="#000" />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('user');

  const {
    modalVisible,
    modalTitle,
    logoutModalVisible,
    showModal,
    hideModal,
    showLogoutModal,
    hideLogoutModal,
  } = useSettingsModals();

  const menuItems = [
    { id: 1, title: 'My Account', route: 'Account' },
    { id: 2, title: 'About Us', route: 'About' },
    { id: 3, title: 'Kape Delivery', route: 'Delivery' },
    { id: 4, title: 'Terms and Conditions', route: 'Terms' },
    { id: 5, title: 'Feedback', route: 'Feedback' },
    { id: 6, title: 'Help and Support', route: 'Help' },
    { id: 7, title: 'Logout', route: 'LandPage' },
  ];

  const handleMenuPress = (item) => {
    if (item.title === 'Logout') {
      showLogoutModal();
    } else {
      showModal(item.title);
    }
  };

  const confirmLogout = () => {
    hideLogoutModal();
    navigation.navigate('LandPage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {menuItems.map(item => (
          <SettingsItem
            key={item.id}
            title={item.title}
            onPress={() => handleMenuPress(item)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>
              Settings under maintenance for now. Will update you upon completion.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={hideLogoutModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.logoutButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={hideLogoutModal}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  spacer: { width: 28 }, // replaced inline
  scrollContent: { paddingBottom: 100 }, // replaced inline
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FDF5E6', paddingHorizontal: 25, paddingVertical: 25, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuText: { fontSize: 15, color: '#000', fontWeight: '400' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalMessage: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 15 },
  modalButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  logoutButtons: { flexDirection: 'row', justifyContent: 'center' },
  cancelButton: { backgroundColor: '#ccc', marginRight: 10 },
  cancelButtonText: { color: '#000' },
});
