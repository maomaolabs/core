import { memo, useCallback, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../../styles/toolbar/ToolbarDesktop.module.css'
import { WindowInstance, FolderDefinition } from "../../../types";
import ToolbarButton from "../common/ToolbarButton";
import { FolderIcon } from './FolderIcon';
import { OptionButtonItem } from './OptionButtonItem';

export const FolderItem = memo(({ folder, currentWindows, openWindow }: {
  folder: FolderDefinition,
  currentWindows: WindowInstance[],
  openWindow: (w: WindowInstance) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ left: number, bottom: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMenuPosition({
          left: rect.left + rect.width / 2,
          bottom: window.innerHeight - rect.top + 10
        });
      }
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.folderWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isMounted && menuPosition && typeof document !== 'undefined' && createPortal(
        <div
          className={`${styles.folderMenuPortal} ${isVisible ? styles.folderMenuPortalVisible : ''}`}
          style={{
            left: menuPosition.left,
            bottom: menuPosition.bottom,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {folder.apps.map((app) => (
            <OptionButtonItem
              key={app.id}
              window={app}
              currentWindows={currentWindows}
              openWindow={openWindow}
            />
          ))}
          <div className={styles.folderLabel}>{folder.title}</div>
        </div>,
        document.body
      )}

      <ToolbarButton
        icon={folder.icon || <FolderIcon />}
        label={folder.title}
        onClick={() => setIsOpen((prev) => !prev)}
        isActive={false}
        showTooltip={false}
      />
    </div>
  );
});
