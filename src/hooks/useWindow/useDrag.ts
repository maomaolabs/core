import { useRef, useCallback, useMemo } from 'react';
import { Position, Size } from './types';

export function useDrag(
  size: Size,
  position: Position,
  windowRef: React.RefObject<HTMLDivElement>,
  onMove: (pos: Position) => void,
  onSnapCheck?: (x: number) => void
) {
  const isDragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const dragTo = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    onSnapCheck?.(e.clientX);

    const x = Math.min(
      Math.max(0, e.clientX - start.current.x),
      window.innerWidth - size.width
    );
    const y = Math.min(
      Math.max(0, e.clientY - start.current.y),
      window.innerHeight - size.height
    );

    if (windowRef.current) {
      windowRef.current.style.left = `${x}px`;
      windowRef.current.style.top = `${y}px`;
    }

    onMove({ x, y });
  }, [size, onMove, onSnapCheck]);

  const startDrag = useCallback((e: React.MouseEvent) => {
    start.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    isDragging.current = true;
  }, [position.x, position.y]);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  return useMemo(() => ({
    dragTo,
    startDrag,
    stopDrag,
    isDragging
  }), [dragTo, startDrag, stopDrag]);
}
