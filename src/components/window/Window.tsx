'use client'

import React from 'react'
import { WindowContext } from './WindowContext'
import { useWindowActions } from '../../store/WindowStore'
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
  const { closeWindow, focusWindow, updateWindow, setSnapPreview } = useWindowActions()

  const [isOpen, setIsOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { closeWindow(windowInstance.id); }, 200);
  };

  const handleMinimize = () => updateWindow(windowInstance.id, { isMinimized: true });
  const handleMaximize = () => updateWindow(windowInstance.id, { isMaximized: true, isMinimized: false, isSnapped: false });
  const handleRestore = () => updateWindow(windowInstance.id, { isMinimized: false, isMaximized: false, isSnapped: false });

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

  const uiValue: WindowContextState = {
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
  }

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
