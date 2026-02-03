'use client'
import styles from '../../styles/SnapOverlay.module.css'

interface SnapOverlayProps {
  side: 'left' | 'right' | null;
}

export default function SnapOverlay({ side }: SnapOverlayProps) {
  if (!side) return null;
  return (
    <>
      <div
        className={`
            ${styles.overlay} 
            ${styles.left} 
            ${side === 'left' ? styles.visible : ''}
        `}
      />
      <div
        className={`
            ${styles.overlay} 
            ${styles.right} 
            ${side === 'right' ? styles.visible : ''}
        `}
      />
    </>
  )
}
