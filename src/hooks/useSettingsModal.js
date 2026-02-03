import { useState } from 'react';

const useSettingsModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const showModal = (title) => {
    setModalTitle(title);
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);
  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);

  return {
    modalVisible,
    modalTitle,
    logoutModalVisible,
    showModal,
    hideModal,
    showLogoutModal,
    hideLogoutModal,
  };
};

export default useSettingsModals;
