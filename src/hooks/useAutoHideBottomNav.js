import { useState, useRef, useCallback } from 'react';

export default function useAutoHideBottomNav({ threshold = 10, initialVisible = true } = {}) {
  const [visible, setVisible] = useState(initialVisible);
  const lastY = useRef(0);

  const onScroll = useCallback(
    (event) => {
      const y = event.nativeEvent.contentOffset.y;
      const dy = y - lastY.current;

      lastY.current = y;

      if (Math.abs(dy) < threshold) return;

      if (dy > 0) {
        setVisible(false);
      } else if (dy < 0) {
        setVisible(true);
      }
    },
    [threshold]
  );

  return { visible, onScroll };
}
