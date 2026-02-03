import React, { memo, useCallback } from 'react';
import commonStyles from '../../styles/toolbar/Toolbar.module.css'
import styles from '../../styles/toolbar/ToolbarDesktop.module.css'
import { WindowDefinition, WindowInstance } from "../../types";
import SleepyMao from './SleepyMao';
import ToolbarButton from "./ToolbarButton";

type ToolbarDesktopProps = {
  openWindow: (window: WindowInstance) => void
  closeWindow: (windowId: string) => void
  windowsOptions: WindowDefinition[]
  currentWindows: WindowInstance[]
  isOpen: boolean
  toggleOpen: () => void
  setIsOpen: (isOpen: boolean) => void
}

const CAT_ICONS = {
  idle: '/\\_/\\\n( -.- )\n> ^ <',
  active: '/\\_/\\\n( >.< )\n> ^ <',
  open: '/\\_/\\\n( ^.^ )\n> ^ <',
};

const WindowButtonItem = memo(({ window, currentWindows, openWindow, closeWindow }: {
  window: WindowInstance,
  currentWindows: WindowInstance[],
  openWindow: (w: WindowInstance) => void,
  closeWindow: (id: string) => void
}) => {
  const isActive = currentWindows.some((ow) => ow.id === window.id);
  const handleOpen = useCallback(() => openWindow({ ...window, zIndex: 0 }), [openWindow, window]);
  const handleClose = useCallback(() => closeWindow(window.id), [closeWindow, window.id]);

  return (
    <ToolbarButton
      icon={window.icon}
      label={window.title}
      onClick={handleOpen}
      isActive={isActive}
      onClose={handleClose}
      component={window.component}
      windowId={window.id}
    />
  );
});

const OptionButtonItem = memo(({ window, currentWindows, openWindow }: {
  window: WindowDefinition,
  currentWindows: WindowInstance[],
  openWindow: (w: WindowInstance) => void
}) => {
  const isActive = currentWindows.some((ow) => ow.id === window.id);
  const handleOpen = useCallback(() => openWindow({ ...window, zIndex: 0 } as WindowInstance), [openWindow, window]);

  return (
    <ToolbarButton
      icon={window.icon}
      label={window.title}
      onClick={handleOpen}
      isActive={isActive}
    />
  );
});


export default function ToolbarDesktop({ openWindow, closeWindow, windowsOptions = [], currentWindows, isOpen, toggleOpen, setIsOpen }: ToolbarDesktopProps) {
  const currentIcon = isOpen
    ? CAT_ICONS.open
    : currentWindows.length > 0
      ? CAT_ICONS.active
      : CAT_ICONS.idle;

  return (
    <div className={`${commonStyles.container} ${commonStyles.desktopOnly}`}>
      <div className={styles.dock}>
        <div className={`${styles.currentOpenedWindows} ${currentWindows.length > 0 ? styles.currentOpenedWindowsVisible : ''}`}>
          {currentWindows.map((w) => (
            <WindowButtonItem
              key={w.id}
              window={w}
              currentWindows={currentWindows}
              openWindow={openWindow}
              closeWindow={closeWindow}
            />
          ))}
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button
            className={styles.launcher}
            onClick={toggleOpen}
          >
            <SleepyMao show={!isOpen && currentWindows.length === 0} />

            <span className={commonStyles.icon}
              style={{
                fontSize: '0.6rem',
                whiteSpace: 'pre',
                lineHeight: 1.1,
                fontFamily: 'monospace',
                textAlign: 'center'
              }}
            >
              {currentIcon}
            </span>
          </button>

          <div className={`${styles.items} ${isOpen ? styles.itemsVisible : ''}`}>
            {
              windowsOptions.map((w) => {
                if (!currentWindows.some((ow) => ow.id === w.id)) {
                  return (
                    <OptionButtonItem
                      key={w.id}
                      window={w}
                      currentWindows={currentWindows}
                      openWindow={openWindow}
                    />
                  )
                }
                return null;
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
