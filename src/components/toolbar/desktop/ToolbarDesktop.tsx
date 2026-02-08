import React from 'react'
import styles from '../../../styles/toolbar/ToolbarDesktop.module.css'
import { WindowInstance, ToolbarItem } from "../../../types"
import SleepyMao from '../common/SleepyMao'
import { OptionButtonItem } from './OptionButtonItem'
import { FolderItem } from './FolderItem'
import { WindowButtonItem } from './WindowButtonItem'
import { useToolbarItems } from '../../../hooks/useToolbarItems'

type ToolbarDesktopProps = {
  openWindow: (window: WindowInstance) => void
  closeWindow: (windowId: string) => void
  windowsOptions: ToolbarItem[]
  currentWindows: WindowInstance[]
  isOpen: boolean
  toggleOpen: () => void
  setIsOpen: (isOpen: boolean) => void
}

const CAT_ICONS = {
  idle: '/\\_/\\\n( -.- )\n> ^ <',
  active: '/\\_/\\\n( >.< )\n> ^ <',
  open: '/\\_/\\\n( ^.^ )\n> ^ <',
} as const

export default function ToolbarDesktop({
  openWindow,
  closeWindow,
  windowsOptions: rawWindowsOptions = [],
  currentWindows,
  isOpen,
  toggleOpen,
  setIsOpen
}: ToolbarDesktopProps) {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const { windowsOptions, isFolder } = useToolbarItems(rawWindowsOptions, currentWindows)

  const currentIcon = isOpen
    ? CAT_ICONS.open
    : currentWindows.length > 0
      ? CAT_ICONS.active
      : CAT_ICONS.idle

  const clearAutoClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleDockEnter = () => {
    clearAutoClose()
    setIsOpen(true)
  }

  const handleMenuEnter = () => {
    clearAutoClose()
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 100)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      className={styles.container}
      role="toolbar"
      aria-label="Desktop Toolbar"
    >
      {/* 1. Left Menu */}
      <div className={`${styles.menuLeft} ${currentWindows.length > 0 ? styles.menuOpen : styles.menuClosed}`}>
        <div className={styles.menuContentLeft}>
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
      </div>

      {/* 2. Dock (Center) */}
      <div
        className={styles.dockWrapper}
        onMouseEnter={handleDockEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.dock}>
          <button
            className={styles.launcher}
            onClick={toggleOpen}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isOpen}
          >
            <SleepyMao show={!isOpen && currentWindows.length === 0} />
            <span className={`${styles.catIcon}`}>
              {currentIcon}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Right Menu */}
      <div
        className={`${styles.menuRight} ${isOpen ? styles.menuOpen : styles.menuClosed}`}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.menuContentRight}>
          {windowsOptions.map((item, index) => {
            if (isFolder(item)) {
              return (
                <FolderItem
                  key={item.id ?? index}
                  folder={item}
                  currentWindows={currentWindows}
                  openWindow={openWindow}
                />
              )
            }

            if (!currentWindows.some(w => w.id === item.id)) {
              return (
                <OptionButtonItem
                  key={item.id}
                  window={item}
                  currentWindows={currentWindows}
                  openWindow={openWindow}
                />
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
