'use client'

import {
  useState,
  useMemo,
  ReactNode,
} from 'react';
import {
  WindowStateContext,
  WindowDispatchContext,
  WindowSnapContext
} from './window-context';
import { useWindowManager } from '../hooks/useWindowManager';

/**
 * WindowStoreProvider component.
 * Provides the WindowStore context to its children.
 *
 * @param {ReactNode} children - The children to be rendered.
 * @returns {JSX.Element} The WindowStoreProvider component.
 */
export function WindowStoreProvider({ children }: { children: ReactNode }) {
  const { windows, openWindow, closeWindow, focusWindow, updateWindow } = useWindowManager();
  const [snapPreview, setSnapPreview] = useState<{ side: 'left' | 'right' } | null>(null);

  /* 
   * Dispatch actions are stable and do not change over time.
   * This prevents re-renders in components that only consume actions (like Toolbar).
   */
  const dispatchValue = useMemo(() => ({
    openWindow,
    closeWindow,
    focusWindow,
    updateWindow,
  }), [openWindow, closeWindow, focusWindow, updateWindow]);

  /*
   * Snap state changes frequently during drag operations.
   * Isolated in its own context to strictly limit re-renders to the SnapOverlay.
   */
  const snapValue = useMemo(() => ({
    snapPreview,
    setSnapPreview
  }), [snapPreview]);

  return (
    <WindowDispatchContext.Provider value={dispatchValue}>
      <WindowSnapContext.Provider value={snapValue}>
        <WindowStateContext.Provider value={windows}>
          {children}
        </WindowStateContext.Provider>
      </WindowSnapContext.Provider>
    </WindowDispatchContext.Provider>
  );
}
