import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { WindowInstance, WindowStore } from '../types';

// Split contexts
export const WindowStateContext = createContext<WindowInstance[] | null>(null);
type WindowDispatch = Omit<WindowStore, 'windows'>;
export const WindowDispatchContext = createContext<WindowDispatch | null>(null);

/**
 * WindowStoreProvider component.
 * Provides the WindowStore context to its children.
 *
 * @param {ReactNode} children - The children to be rendered.
 * @returns {JSX.Element} The WindowStoreProvider component.
 */
export function WindowStoreProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);

  const openWindow = useCallback((windowInstance: WindowInstance) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    setWindows((prev) => {
      const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
      if (prev.some(w => w.id === windowInstance.id)) {
        return prev.map(w => w.id === windowInstance.id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
      }
      return [...prev, { ...windowInstance, zIndex: maxZ + 1, isMaximized: isMobile ? true : windowInstance.isMaximized }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      // If already top, don't update to avoid unnecessary state change
      // (Optional optimization, but good for performance)
      // For now, simpler logic to ensure consistency:
      const maxZ = Math.max(0, ...prev.map(w => w.zIndex));
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
  }, []);

  const updateWindow = useCallback((id: string, data: Partial<WindowInstance>) => {
    setWindows((prev) => prev.map(w => (w.id === id ? { ...w, ...data } : w)));
  }, []);

  // Memoize dispatch value so it remains referentially stable
  const dispatchValue = useMemo(() => ({
    openWindow,
    closeWindow,
    focusWindow,
    updateWindow,
  }), [openWindow, closeWindow, focusWindow, updateWindow]);

  return (
    <WindowDispatchContext.Provider value={dispatchValue}>
      <WindowStateContext.Provider value={windows}>
        {children}
      </WindowStateContext.Provider>
    </WindowDispatchContext.Provider>
  );
}

/**
 * useWindowDispatcher hook.
 * Provides access to window actions WITHOUT triggering re-renders on state changes.
 */
export function useWindowActions() {
  const dispatch = useContext(WindowDispatchContext);
  if (!dispatch) throw new Error('useWindowActions must be used within WindowStoreProvider');
  return dispatch;
}

/**
 * useWindows hook.
 * Optimized hook for components that ONLY need the list of windows.
 */
export function useWindows() {
  const state = useContext(WindowStateContext);
  if (state === null) throw new Error('useWindows must be used within WindowStoreProvider');
  return state;
}
