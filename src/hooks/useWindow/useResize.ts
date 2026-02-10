import { useRef, useCallback, useMemo } from 'react';
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

    const w = Math.min(window.innerWidth, Math.max(MIN_WIDTH, start.current.w + e.clientX - start.current.x));
    const h = Math.min(window.innerHeight, Math.max(MIN_HEIGHT, start.current.h + e.clientY - start.current.y));

    if (windowRef.current) {
      windowRef.current.style.width = `${w}px`;
      windowRef.current.style.height = `${h}px`;
    }

    onResizeEnd({ width: w, height: h });
  }, [onResizeEnd]);

  const startResize = useCallback((e: React.MouseEvent) => {
    start.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    isResizing.current = true;
  }, [size.width, size.height]);

  const stopResize = useCallback(() => {
    isResizing.current = false;
  }, []);

  return useMemo(() => ({
    resizeTo,
    startResize,
    stopResize,
    isResizing
  }), [resizeTo, startResize, stopResize]);
}
