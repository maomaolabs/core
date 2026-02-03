import React, { ReactNode, useRef, useState, memo } from "react"
import { createPortal } from "react-dom"
import styles from '../../styles/toolbar/ToolbarButton.module.css'
import WindowPreview from "./WindowPreview"
import { CloseButton } from "../window/icons/Close"

type ToolbarButtonProps = {
  icon: ReactNode
  onClick: () => void
  label: string
  isActive?: boolean
  onClose?: () => void
  component?: ReactNode
  windowId?: string
}

function ToolbarButton({ icon, onClick, label, isActive, onClose, component, windowId }: ToolbarButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsHovered(false)
    }, 100)
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.buttonWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && onClose && isActive && typeof document !== 'undefined' && createPortal(
        <div
          className={styles.preview}
          style={{
            position: 'fixed',
            left: wrapperRef.current ? wrapperRef.current.getBoundingClientRect().left + wrapperRef.current.getBoundingClientRect().width / 2 : 0,
            top: wrapperRef.current ? wrapperRef.current.getBoundingClientRect().top : 0,
            bottom: 'auto',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={styles.previewHeader}>
            <span className={styles.previewTitle}>{label}</span>
            <CloseButton
              onClose={
                (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
                  e?.preventDefault()
                  e?.stopPropagation()
                  onClose()
                }
              }
            />
          </div>
          <div className={styles.previewBody} onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}>
            <div className={styles.previewContent}>
              {windowId ? <WindowPreview windowId={windowId} /> : component}
            </div>
          </div>
        </div>,
        document.body
      )}

      <button
        onClick={onClick}
        title={label}
        className={styles.button}
      >
        {icon}
        {isActive && <div className={styles.activeIndicator} />}
      </button>
    </div>
  )
}

const ToolbarButtonMemo = React.memo(ToolbarButton);
export default ToolbarButtonMemo;