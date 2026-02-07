'use client'

import {
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { WindowInstance } from '../types';
import {
  WindowStateContext,
  WindowDispatchContext
} from './window-context';
import { MOBILE_BREAKPOINT } from './constants';

/**
 * WindowStoreProvider component.
 * Provides the WindowStore context to its children.
 *
 * @param {ReactNode} children - The children to be rendered.
 * @returns {JSX.Element} The WindowStoreProvider component.
 */
export function WindowStoreProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [snapPreview, setSnapPreview] = useState<{ side: 'left' | 'right' } | null>(null);

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

  const dispatchValue = useMemo(() => ({
    snapPreview,
    setSnapPreview,
    openWindow,
    closeWindow,
    focusWindow,
    updateWindow,
  }), [snapPreview, openWindow, closeWindow, focusWindow, updateWindow]);

  return (
    <WindowDispatchContext.Provider value={dispatchValue}>
      <WindowStateContext.Provider value={windows}>
        {children}
      </WindowStateContext.Provider>
    </WindowDispatchContext.Provider>
  );
}
