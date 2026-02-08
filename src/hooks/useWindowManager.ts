import { useState, useCallback } from 'react';
import { WindowInstance } from '../types';
import { MOBILE_BREAKPOINT } from '../store/constants';

/**
 * useWindowManager hook.
 * Manages the state and actions for windows.
 */
export function useWindowManager() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);

  const openWindow = useCallback((windowInstance: WindowInstance) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;

    setWindows((prev) => {
      // Bring to front if already exists
      if (prev.some(w => w.id === windowInstance.id)) {
        const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
        return prev.map(w => w.id === windowInstance.id
          ? { ...w, zIndex: maxZ + 1, isMinimized: false }
          : w
        );
      }

      // Add new window
      const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
      const newWindow = {
        ...windowInstance,
        zIndex: maxZ + 1,
        isMaximized: isMobile ? true : windowInstance.isMaximized
      };

      return [...prev, newWindow];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id
        ? { ...w, zIndex: maxZ + 1, isMinimized: false }
        : w
      );
    });
  }, []);

  const updateWindow = useCallback((id: string, data: Partial<WindowInstance>) => {
    setWindows((prev) => prev.map(w => (w.id === id ? { ...w, ...data } : w)));
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    updateWindow
  };
}
