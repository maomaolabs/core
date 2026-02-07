import { useEffect, useRef, useState, useCallback } from 'react';
import { DEFAULT_POSITION, DEFAULT_SIZE } from './constants';
import { useDrag } from './useDrag';
import { useResize } from './useResize';
import { useSnap } from './useSnap';
import { Position, Size, SnapSide } from './types';

export interface WindowStatusProps {
  initialSize?: Size;
  initialPosition?: Position;
  isMinimized: boolean;
  isMaximized: boolean;
  isSnapped?: boolean;
  onSnap?: (side: SnapSide) => void;
  onUnsnap?: () => void;
  setSnapPreview?: (preview: { side: SnapSide } | null) => void;
}

export function useWindowStatus({
  initialSize = DEFAULT_SIZE,
  initialPosition = DEFAULT_POSITION,
  isSnapped,
  onSnap,
  onUnsnap,
  setSnapPreview
}: WindowStatusProps) {
  const [size, setSize] = useState<Size>(initialSize);
  const [position, setPosition] = useState<Position>(initialPosition);

  useEffect(() => setSize(initialSize), [initialSize]);
  useEffect(() => setPosition(initialPosition), [initialPosition]);

  const lastSize = useRef(size);
  const lastPosition = useRef(position);

  const windowRef = useRef<HTMLDivElement>(null);

  const updateLastPosition = useCallback((pos: Position) => {
    lastPosition.current = pos;
  }, []);

  const updateLastSize = useCallback((s: Size) => {
    lastSize.current = s;
  }, []);

  const snap = useSnap(setSnapPreview);
  const drag = useDrag(size, position, windowRef, updateLastPosition, snap.detectSnap);
  const resize = useResize(size, windowRef, updateLastSize);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      drag.dragTo(e);
      resize.resizeTo(e);
    };

    const end = () => {
      if (drag.isDragging.current) {
        if (snap.currentSide.current && onSnap) {
          onSnap(snap.currentSide.current);
          snap.resetSnap();
        } else setPosition(lastPosition.current);
        drag.stopDrag();
      }

      if (resize.isResizing.current) {
        setSize(lastSize.current);
        if (isSnapped) onUnsnap?.();
        resize.stopResize();
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
    };
  }, [drag, resize, onSnap, onUnsnap, isSnapped, snap]);

  /**
   * Returns window state and interaction handlers
   * @returns {Object} Window status object
   * @property {Size} size - Current window size
   * @property {Position} position - Current window position
   * @property {React.RefObject<HTMLDivElement>} windowRef - Reference to window DOM element
   * @property {Function} drag - Function to initiate drag operation
   * @property {Function} resize - Function to initiate resize operation
   * @property {boolean} isDragging - Whether window is currently being dragged
   * @property {boolean} isResizing - Whether window is currently being resized
   */
  return {
    size,
    position,
    windowRef,
    drag: drag.startDrag,
    resize: resize.startResize,
    isDragging: drag.isDragging.current,
    isResizing: resize.isResizing.current
  };
}
