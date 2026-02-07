import { WindowInstance, ToolbarItem } from "../../../types";
import commonStyles from '../../../styles/toolbar/Toolbar.module.css'
import styles from '../../../styles/toolbar/ToolbarMobile.module.css'
import SleepyMao from "../common/SleepyMao";
import { MobileOptionItem } from "./MobileOptionItem";
import { MobileFolderItem } from "./MobileFolderItem";
import { useToolbarItems } from "../../../hooks/useToolbarItems";

type ToolbarMobileProps = {
  openWindow: (window: WindowInstance) => void
  windowsOptions: ToolbarItem[]
  currentWindows: WindowInstance[]
  isOpen: boolean
  toggleOpen: () => void
  setIsOpen: (isOpen: boolean) => void
}

const MOBILE_CAT_ICONS = {
  IDLE: '/\\_/\\\n( -.- )',
  OPEN: '/\\_/\\\n( ^.^ )',
};

export default function ToolbarMobile({
  openWindow,
  windowsOptions: rawWindowsOptions = [],
  currentWindows,
  isOpen,
  toggleOpen,
  setIsOpen
}: ToolbarMobileProps) {
  const { windowsOptions, isFolder } = useToolbarItems(rawWindowsOptions, currentWindows);
  const mobileIcon = isOpen ? MOBILE_CAT_ICONS.OPEN : MOBILE_CAT_ICONS.IDLE;

  const handleCloseMenu = () => setIsOpen(false);

  return (
    <div className={commonStyles.mobileOnly}>
      <div className={`${styles.mobileItems} ${isOpen ? styles.mobileItemsVisible : ''}`}>
        {
          windowsOptions.length === 0 ? (
            <span>No apps available</span>
          ) : (
            windowsOptions.map((item, index) => {
              if (isFolder(item)) {
                return (
                  <MobileFolderItem
                    key={item.id || index}
                    folder={item}
                    currentWindows={currentWindows}
                    openWindow={openWindow}
                    closeMenu={handleCloseMenu}
                  />
                );
              }

              // Standard app item
              return (
                <MobileOptionItem
                  key={item.id}
                  window={item}
                  currentWindows={currentWindows}
                  openWindow={openWindow}
                  closeMenu={handleCloseMenu}
                />
              );
            }))
        }
      </div>

      <button
        className={`${styles.pawButton} ${isOpen ? styles.pawButtonActive : ''}`}
        onClick={toggleOpen}
      >
        <SleepyMao show={!isOpen} />

        <span className={`${commonStyles.icon} ${styles.mobileIcon}`}>
          {mobileIcon}
        </span>
      </button>
    </div>
  )
}