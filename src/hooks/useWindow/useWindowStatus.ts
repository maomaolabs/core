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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

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

  const startDrag = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    drag.startDrag(e);
  }, [drag]);

  const startResize = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    resize.startResize(e);
  }, [resize]);

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
        } else {
          setPosition(lastPosition.current);
        }
        drag.stopDrag();
        setIsDragging(false);
      }

      if (resize.isResizing.current) {
        setSize(lastSize.current);
        if (isSnapped) onUnsnap?.();
        resize.stopResize();
        setIsResizing(false);
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
    };
  }, [drag, resize, onSnap, onUnsnap, isSnapped, snap]);

  return {
    size,
    position,
    windowRef,
    drag: startDrag,
    resize: startResize,
    isDragging,
    isResizing
  };
}
