import { createContext, useContext } from 'react';
import { WindowInstance, WindowStore } from '../types';

export type WindowDispatch = Omit<WindowStore, 'windows' | 'snapPreview' | 'setSnapPreview'>;

export const WindowStateContext = createContext<WindowInstance[] | null>(null);
export const WindowDispatchContext = createContext<WindowDispatch | null>(null);
export const WindowSnapContext = createContext<{
  snapPreview: { side: 'left' | 'right' } | null;
  setSnapPreview: (preview: { side: 'left' | 'right' } | null) => void;
} | null>(null);

/**
 * useWindowActions hook.
 * Provides access to window actions WITHOUT triggering re-renders on state changes.
 */
export function useWindowActions() {
  const dispatch = useContext(WindowDispatchContext);
  if (!dispatch) throw new Error('useWindowActions must be used within WindowStoreProvider');
  return dispatch;
}

/**
 * useWindowSnap hook.
 * Provides access to snap preview state.
 */
export function useWindowSnap() {
  const context = useContext(WindowSnapContext);
  if (!context) throw new Error('useWindowSnap must be used within WindowStoreProvider');
  return context;
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
