import { useMemo } from 'react';
import { Platform } from 'react-native';

/**
 * usePlatform
 * Small hook that exposes platform info (isAndroid, isIOS, platform)
 */
export default function usePlatform() {
  return useMemo(() => ({
    platform: Platform.OS,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
  }), []);
}
