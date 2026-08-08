import { useState, useEffect, useCallback } from 'react';

export function usePullToRefresh(onRefresh: () => void) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Skip pull-to-refresh when body scroll is locked (e.g. mobile menu open)
    if (document.body.style.overflow === 'hidden') return;
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (startY === null || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);

    if (distance > 0) {
      setPullDistance(distance);
      e.preventDefault(); // Prevent default scrolling
    }
  }, [startY, isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 80 && !isRefreshing) { // Minimum pull distance
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setStartY(null);
    setPullDistance(0);
  }, [pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isRefreshing, pullDistance };
}

