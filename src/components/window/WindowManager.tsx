'use client'

import { useWindows } from '../../store/WindowStore'
import Window from './Window'
import styles from '../../styles/WindowManager.module.css'

/**
 * Main window manager component.
 * Renders all active windows managed by the WindowStore.
 * 
 * @returns {JSX.Element} The window manager container.
 */
export default function WindowManager() {
  const windows = useWindows()

  return (
    <div className={styles.manager}>
      {windows.map((w) => (
        <Window key={w.id} window={w} />
      ))}
    </div>
  )
}
