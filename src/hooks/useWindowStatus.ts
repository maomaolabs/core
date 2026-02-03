import { useRef, useState, useEffect, useCallback } from "react"

export interface WindowStatusProps {
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  isMinimized: boolean;
  isMaximized: boolean;
}

/**
 * useWindowStatus hook.
 * Provides access to the WindowStore context and manages window status,
 * such as size, position, and dragging and resizing states.
 * 
 * @returns {WindowStore} The WindowStore context.
 */
export function useWindowStatus({
  initialSize,
  initialPosition,
  isMinimized,
  isMaximized,
}: WindowStatusProps) {
  const MIN_HEIGHT = 42;
  const MIN_WIDTH = 300;

  const [size, setSize] = useState(initialSize || { width: 500, height: 300 })
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 })

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const isDraggingRef = useRef(false)
  const isResizingRef = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const lastFloatingSize = useRef({ width: 500, height: 300 })
  const lastFloatingPosition = useRef({ x: 100, y: 100 })

  const windowRef = useRef<HTMLDivElement>(null)

  const preventSelect = (e: Event) => e.preventDefault();

  useEffect(() => {
    if (!isMaximized && !isMinimized) {
      lastFloatingSize.current = size;
      lastFloatingPosition.current = position;
    }
  }, [size, position, isMaximized, isMinimized]);

  const cleanSelectedText = () => {
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
  }

  const dragTo = useCallback((e: MouseEvent) => {
    cleanSelectedText()
    if (!isDraggingRef.current) return

    // Calculate new position
    const newX = Math.min(Math.max(0, e.clientX - dragStart.current.x), window.innerWidth - size.width)
    const newY = Math.min(Math.max(0, e.clientY - dragStart.current.y), window.innerHeight - size.height)

    // Update DOM directly for performance (bypass React render cycle)
    if (windowRef.current) {
      windowRef.current.style.left = `${newX}px`
      windowRef.current.style.top = `${newY}px`
    }

    // Track position for state sync on mouseup
    lastFloatingPosition.current = { x: newX, y: newY }
  }, [size])

  const resizeTo = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return

    cleanSelectedText()

    const deltaX = e.clientX - resizeStart.current.x
    const deltaY = e.clientY - resizeStart.current.y

    const newWidth = Math.max(MIN_WIDTH, resizeStart.current.width + deltaX)
    const newHeight = Math.max(MIN_HEIGHT, resizeStart.current.height + deltaY)

    if (windowRef.current) {
      windowRef.current.style.width = `${newWidth}px`
      windowRef.current.style.height = `${newHeight}px`
    }

    lastFloatingSize.current = { width: newWidth, height: newHeight }
  }, [])


  const end = useCallback(() => {
    if (isDraggingRef.current) {
      setPosition(lastFloatingPosition.current)
    }
    if (isResizingRef.current) {
      setSize(lastFloatingSize.current)
    }

    isDraggingRef.current = false
    isResizingRef.current = false
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (isDraggingRef.current) dragTo(e)
      if (isResizingRef.current) resizeTo(e)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', end)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', end)
    }
  }, [dragTo, resizeTo, end])

  const drag = (e: React.MouseEvent) => {
    if (isMaximized) return
    document.addEventListener('selectstart', preventSelect);
    isDraggingRef.current = true
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    document.removeEventListener('selectstart', preventSelect);
  }

  const resize = (e: React.MouseEvent) => {
    if (isMaximized) return
    isResizingRef.current = true
    setIsResizing(true)
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height }
  }

  return {
    size, position, isDragging, isResizing,
    drag, resize, windowRef
  }
}