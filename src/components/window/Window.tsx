'use client'

import React, { useMemo, useCallback } from 'react'
import { WindowContext } from './WindowContext'
import { useWindowActions, useWindowSnap } from '../../store/window-context'
import { useWindowStatus } from '../../hooks/useWindow/useWindowStatus'
import WindowHeader from './WindowHeader'

import styles from '../../styles/Window.module.css'
import { WindowProps, WindowContextState } from '../../types'


/**
 * Window component.
 * Renders a window with a header, content, and resize handle.
 * 
 * @param {WindowProps} props - The window properties.
 * @returns {JSX.Element} The window component.
 */
const Window: React.FC<WindowProps> = ({ window: windowInstance }) => {
  const { closeWindow, focusWindow, updateWindow } = useWindowActions()
  const { setSnapPreview } = useWindowSnap()

  const [isOpen, setIsOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => { closeWindow(windowInstance.id); }, 200);
  }, [closeWindow, windowInstance.id]);

  const handleMinimize = useCallback(() => {
    updateWindow(windowInstance.id, { isMinimized: true });
  }, [updateWindow, windowInstance.id]);

  const handleMaximize = useCallback(() => {
    updateWindow(windowInstance.id, { isMaximized: true, isMinimized: false, isSnapped: false });
  }, [updateWindow, windowInstance.id]);

  const handleRestore = useCallback(() => {
    updateWindow(windowInstance.id, { isMinimized: false, isMaximized: false, isSnapped: false });
  }, [updateWindow, windowInstance.id]);

  const handleSnap = React.useCallback((side: 'left' | 'right') => {
    const width = window.innerWidth / 2;
    const height = window.innerHeight;
    const x = side === 'left' ? 0 : width;

    updateWindow(windowInstance.id, {
      isSnapped: true,
      isMaximized: false,
      isMinimized: false,
      size: { width, height },
      position: { x, y: 0 }
    });
  }, [updateWindow, windowInstance.id]);

  const handleUnsnap = React.useCallback(() => {
    updateWindow(windowInstance.id, { isSnapped: false });
  }, [updateWindow, windowInstance.id]);

  const {
    size,
    position,
    isDragging,
    isResizing,
    drag,
    resize,
    windowRef
  } = useWindowStatus({
    initialSize: windowInstance.size,
    initialPosition: windowInstance.position,
    isMinimized: windowInstance.isMinimized || false,
    isMaximized: windowInstance.isMaximized || false,
    isSnapped: windowInstance.isSnapped || false,
    onSnap: handleSnap,
    onUnsnap: handleUnsnap,
    setSnapPreview
  })

  const uiValue: WindowContextState = useMemo(() => ({
    size,
    position,
    isDragging,
    isResizing,
    drag,
    resize,
    windowRef,
    isMinimized: windowInstance.isMinimized || false,
    isMaximized: windowInstance.isMaximized || false,
    isSnapped: windowInstance.isSnapped || false,
    minimize: handleMinimize,
    maximize: handleMaximize,
    restore: handleRestore
  }), [size, position, isDragging, isResizing, drag, resize, windowRef, windowInstance.isMinimized, windowInstance.isMaximized, windowInstance.isSnapped, handleMinimize, handleMaximize, handleRestore])

  const isVisible = isOpen && !isClosing && !windowInstance.isMinimized;
  const isMaximized = windowInstance.isMaximized;
  const isMinimized = windowInstance.isMinimized;

  return (
    <WindowContext.Provider value={uiValue}>
      <div
        ref={windowRef}
        id={`window-${windowInstance.id}`}
        className={`window-container
            ${styles.container}
            ${!isDragging && !isResizing ? `${styles.transition} window-transition` : ''}
            ${isVisible ? styles.visible : styles.hidden}
            ${isMaximized ? styles.maximized : ''}
            ${isMinimized ? styles.minimized : ''}
        `}
        style={{
          width: isMaximized ? undefined : size.width,
          height: isMinimized ? undefined : isMaximized ? undefined : size.height,
          left: isMaximized ? undefined : position.x,
          top: isMaximized ? undefined : position.y,
          zIndex: windowInstance.zIndex,
          display: 'flex',
          pointerEvents: isMinimized ? 'none' : 'auto'
        }}
        onMouseDown={() => focusWindow(windowInstance.id)}
      >
        <WindowHeader
          onClose={handleClose}
          title={windowInstance.title}
          icon={windowInstance.icon}
        />

        <div
          className={`window-scrollbar ${styles.scrollbar} ${styles.content}`}
          style={{ display: isMinimized ? 'none' : 'flex' }}
        >
          {windowInstance.component}
        </div>

        {!isMaximized && (
          <div
            className={`window-resize-handle ${styles.resizeHandle}`}
            onMouseDown={resize}
          />
        )}

      </div>
    </WindowContext.Provider>
  )
}

export default React.memo(Window)
