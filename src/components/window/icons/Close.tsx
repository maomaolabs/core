import styles from '../../../styles/WindowControls.module.css'
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

type Props = {
  onClose: (e?:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function CloseButton({ onClose }: Props) {
  return (
    <button
      className={`terminal-btn close ${styles.button} ${styles.close}`}
      onClick={onClose}
      title="Close"
    >
      <CloseIcon />
    </button>
  )
}