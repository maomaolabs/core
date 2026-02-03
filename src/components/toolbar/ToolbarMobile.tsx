import { WindowDefinition, WindowInstance } from "../../types";
import ToolbarButton from "./ToolbarButton";
import commonStyles from '../../styles/toolbar/Toolbar.module.css'
import styles from '../../styles/toolbar/ToolbarMobile.module.css'
import SleepyMao from "./SleepyMao";

type ToolbarMobileProps = {
  openWindow: (window: WindowInstance) => void
  windowsOptions: WindowDefinition[]
  currentWindows: WindowInstance[]
  isOpen: boolean
  toggleOpen: () => void
  setIsOpen: (isOpen: boolean) => void
}

const MOBILE_CAT_ICONS = {
  IDLE: '/\\_/\\\n( -.- )',
  OPEN: '/\\_/\\\n( ^.^ )',
};

export default function ToolbarMobile({ openWindow, windowsOptions = [], currentWindows, isOpen, toggleOpen, setIsOpen }: ToolbarMobileProps) {
  const mobileIcon = isOpen ? MOBILE_CAT_ICONS.OPEN : MOBILE_CAT_ICONS.IDLE;

  return (
    <div className={commonStyles.container}>
      <div className={`${styles.mobileItems} ${isOpen ? styles.mobileItemsVisible : ''}`}>
        {windowsOptions.map((w) => (
          <ToolbarButton
            key={w.id}
            icon={w.icon}
            label={w.title}
            onClick={() => {
              openWindow({ ...w, zIndex: 0 });
              setIsOpen(false);
            }}
            isActive={currentWindows.some((ow) => ow.id === w.id)}
          />
        ))}
      </div>

      <button
        className={`${styles.pawButton} ${isOpen ? styles.pawButtonActive : ''}`}
        onClick={toggleOpen}
      >
        <SleepyMao show={!isOpen} />

        <span className={commonStyles.icon} style={{
          fontSize: '0.9rem',
          whiteSpace: 'pre',
          lineHeight: 1.2,
          fontFamily: 'monospace',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
          {mobileIcon}
        </span>
      </button>
    </div>
  )
}