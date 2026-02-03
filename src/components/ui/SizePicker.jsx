// src/components/ui/SizePicker.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SizePicker = ({
  value,
  onChange,
  sizes = ['S', 'M', 'L', 'XL'],
  compact = false,
  buttonSize = 40,
  spacing = 6,
  buttonStyle,
  textStyle,
  containerStyle,
}) => {
  const dynamicButton = { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2, marginHorizontal: spacing };

  return (
    <View style={[styles.container, compact && styles.compactContainer, containerStyle]}>
      {sizes.map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => onChange && onChange(s)}
          style={[styles.button, dynamicButton, buttonStyle, value === s && styles.buttonActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, textStyle, value === s && styles.textActive]}>{s}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContainer: {
    marginTop: 6,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8E4DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonActive: {
    backgroundColor: '#B8956A',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  textActive: {
    color: '#000',
  },
});

export default SizePicker;
