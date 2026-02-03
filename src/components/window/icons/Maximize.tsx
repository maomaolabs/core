import styles from '../../../styles/WindowControls.module.css'

type Props = {
  onClick: () => void
  isMaximized: boolean
}

const MaximizeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
)

const RestoreIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="9" width="14" height="14" rx="2" ry="2"></rect>
    <path d="M9 5h10a2 2 0 0 1 2 2v10"></path>
  </svg>
)

export function MaximizeButton({ onClick, isMaximized }: Props) {
  return (
    <button
      className={`terminal-btn ${styles.button}`}
      onClick={() => { onClick() }}
      title={isMaximized ? "Restore" : "Maximize"}
    >
      {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
    </button>
  )
}

