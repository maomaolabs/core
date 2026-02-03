import { useRef, useCallback } from 'react';
import { MIN_HEIGHT, MIN_WIDTH } from './constants';
import { Size } from './types';

export function useResize(
  size: Size,
  windowRef: React.RefObject<HTMLDivElement>,
  onResizeEnd: (size: Size) => void
) {
  const isResizing = useRef(false);
  const start = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const resizeTo = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    const w = Math.max(MIN_WIDTH, start.current.w + e.clientX - start.current.x);
    const h = Math.max(MIN_HEIGHT, start.current.h + e.clientY - start.current.y);

    if (windowRef.current) {
      windowRef.current.style.width = `${w}px`;
      windowRef.current.style.height = `${h}px`;
    }

    onResizeEnd({ width: w, height: h });
  }, [onResizeEnd]);

  const startResize = (e: React.MouseEvent) => {
    start.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    isResizing.current = true;
  };

  const stopResize = () => isResizing.current = false;

  return { resizeTo, startResize, stopResize, isResizing };
}
