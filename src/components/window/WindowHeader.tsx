'use client'

import { CloseButton } from "./icons/Close";
import { MaximizeButton } from "./icons/Maximize";
import { MinimizeButton } from "./icons/Minimize";
import { useWindowUI } from "./WindowContext";
import styles from '../../styles/Window.module.css'
import brandStyles from '../../styles/WindowBrand.module.css'
import controlStyles from '../../styles/WindowControls.module.css'
import { WindowHeaderProps } from "../../types";

export default function WindowHeader({ onClose, title, icon }: WindowHeaderProps) {
  const {
    drag,
    isMaximized,
    isMinimized,
    minimize,
    maximize,
    restore
  } = useWindowUI()

  return (
    <div
      className={`window-header ${styles.header}`}
      onMouseDown={drag}
    >
      <span className={`window-title ${brandStyles.title}`}>
        {icon && <span className={`window-icon ${brandStyles.windowIcon} ${brandStyles.brandText}`}>{icon}</span>}
        <span className={`brand-text ${brandStyles.brandText}`}>
          {title}
        </span>
      </span>

      <div className={`window-controls ${controlStyles.controls}`}>
        <MinimizeButton onClick={minimize} isMinimized={isMinimized} />
        <MaximizeButton onClick={isMaximized ? restore : maximize} isMaximized={isMaximized} />
        <CloseButton onClose={onClose} />
      </div>
    </div>
  )
}