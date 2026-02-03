import { createContext, useContext } from 'react';
import { WindowContextState } from '../../types';

export const WindowContext = createContext<WindowContextState | null>(null);

/**
 * useWindowUI hook.
 * Provides access to the WindowContext.
 * 
 * @returns {WindowContextState} The WindowContext.
 */
export const useWindowUI = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error('useWindowUI must be used within Window (WindowContext.Provider)');
  return context;
};
