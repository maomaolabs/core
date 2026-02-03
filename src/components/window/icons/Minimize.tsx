import styles from '../../../styles/WindowControls.module.css'

type Props = {
  onClick: () => void
  isMinimized: boolean
}

export const MinimizeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

export function MinimizeButton({ onClick, isMinimized }: Props) {
  return (
    <button
      className={`terminal-btn ${styles.button}`}
      onClick={() => { onClick(); }}
      disabled={isMinimized}
      title={isMinimized ? "Restore" : "Minimize"}
    >
      <MinimizeIcon />
    </button>
  )
}

