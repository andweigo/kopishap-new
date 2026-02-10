import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ToastNotification = ({ id, message, type, index = 0, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger the disappearance based on index (e.g., 1st item: 3000ms, 2nd: 3500ms, etc.)
    const timer = setTimeout(() => {
      handleHide();
    }, 3000 + (index * 500));

    return () => clearTimeout(timer);
  }, [index]);

  const handleHide = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(id);
    });
  };

  const getIconName = () => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      default: return 'info';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return '#27ae60';
      case 'error': return '#e74c3c';
      default: return '#3498db';
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }], borderLeftColor: getBorderColor() }]}>
      <Icon name={getIconName()} size={20} color={getBorderColor()} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={handleHide}>
        <Icon name="x" size={16} color="#999" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', width: '90%', alignSelf: 'center', padding: 16, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, borderLeftWidth: 4 },
  icon: { marginRight: 12 },
  message: { flex: 1, fontSize: 14, color: '#2c3e50', fontWeight: '500' },
});

export default ToastNotification;