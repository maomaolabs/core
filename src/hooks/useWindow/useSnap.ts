import { useRef, useCallback, useMemo } from 'react';
import { SNAP_THRESHOLD } from './constants';
import { SnapSide } from './types';

export function useSnap(setSnapPreview?: (p: { side: SnapSide } | null) => void) {
  const currentSide = useRef<SnapSide | null>(null);

  const detectSnap = useCallback((x: number) => {
    const screenW = window.innerWidth;
    let next: SnapSide | null = null;

    if (x < SNAP_THRESHOLD) next = 'left';
    else if (x > screenW - SNAP_THRESHOLD) next = 'right';

    if (next !== currentSide.current) {
      currentSide.current = next;
      setSnapPreview?.(next ? { side: next } : null);
    }
  }, [setSnapPreview]);

  const resetSnap = useCallback(() => {
    currentSide.current = null;
    setSnapPreview?.(null);
  }, [setSnapPreview]);

  return useMemo(() => ({ currentSide, detectSnap, resetSnap }), [detectSnap, resetSnap]);
}
