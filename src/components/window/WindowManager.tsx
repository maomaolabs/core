'use client'

import { useWindows, useWindowActions, useWindowSnap } from '../../store/window-context'
import Window from './Window'
import SnapOverlay from './SnapOverlay'
import styles from '../../styles/WindowManager.module.css'

/**
 * Main window manager component.
 * Renders all active windows managed by the WindowStore.
 * 
 * @returns {JSX.Element} The window manager container.
 */
export default function WindowManager() {
  const windows = useWindows()
  const { snapPreview } = useWindowSnap()

  return (
    <div className={styles.manager}>
      <SnapOverlay side={snapPreview ? snapPreview.side : null} />
      {windows.map((w) => (
        <Window key={w.id} window={w} />
      ))}
    </div>
  )
}
