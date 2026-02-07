/**
 * FavoriteButton Component
 * A reusable button component for toggling favorite status
 * Uses useFavoriteButton hook following OOP principles
 */
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import useFavoriteButton from '../../hooks/useFavoriteButton';

const FavoriteButton = ({ item, size = 20, style, onFavoriteChange, onBeforeRemove }) => {
  const { isFavorite, toggleFavorite, loading } = useFavoriteButton(item, {
    onFavoriteChange,
    onBeforeRemove,
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={toggleFavorite}
      activeOpacity={0.7}
      disabled={loading}
    >
      <Icon
        name="heart"
        size={size}
        color={isFavorite ? '#e74c3c' : '#7f8c8d'}
        fill={isFavorite ? '#e74c3c' : 'none'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoriteButton;
