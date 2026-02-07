
import { memo, useCallback, useState } from 'react';
import styles from '../../../styles/toolbar/ToolbarMobile.module.css';
import { WindowInstance, FolderDefinition } from "../../../types";
import ToolbarButton from "../common/ToolbarButton";
import { FolderIcon } from '../desktop/FolderIcon';
import { MobileOptionItem } from './MobileOptionItem';

export const MobileFolderItem = memo(({ folder, currentWindows, openWindow, closeMenu }: {
  folder: FolderDefinition,
  currentWindows: WindowInstance[],
  openWindow: (w: WindowInstance) => void,
  closeMenu: () => void
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.folderContainer}>
      <div className={styles.folderHeader}>
        <ToolbarButton
          icon={folder.icon || <FolderIcon />}
          label={folder.title}
          onClick={() => setIsExpanded(prev => !prev)}
          isActive={isExpanded}
          showTooltip={false}
        />
      </div>

      {isExpanded && (
        <div className={styles.folderContent}>
          {folder.apps.map((app) => (
            <MobileOptionItem
              key={app.id}
              window={app}
              currentWindows={currentWindows}
              openWindow={openWindow}
              closeMenu={closeMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
});
