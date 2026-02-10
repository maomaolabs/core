import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSnap } from '../useWindow/useSnap';
import { SNAP_THRESHOLD } from '../useWindow/constants';

describe('useSnap', () => {
  const setSnapPreview = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.innerWidth = 1000;
  });

  it('should not snap if within bounds', () => {
    const { result } = renderHook(() => useSnap(setSnapPreview));

    act(() => {
      result.current.detectSnap(500); 
    });

    expect(result.current.currentSide.current).toBeNull();
    expect(setSnapPreview).not.toHaveBeenCalled();
  });

  it('should detect left snap', () => {
    const { result } = renderHook(() => useSnap(setSnapPreview));

    act(() => {
      result.current.detectSnap(SNAP_THRESHOLD - 1);
    });

    expect(result.current.currentSide.current).toBe('left');
    expect(setSnapPreview).toHaveBeenCalledWith({ side: 'left' });
  });

  it('should detect right snap', () => {
    const { result } = renderHook(() => useSnap(setSnapPreview));

    act(() => {
      result.current.detectSnap(1000 - SNAP_THRESHOLD + 1);
    });

    expect(result.current.currentSide.current).toBe('right');
    expect(setSnapPreview).toHaveBeenCalledWith({ side: 'right' });
  });

  it('should reset snap', () => {
    const { result } = renderHook(() => useSnap(setSnapPreview));

    act(() => {
      result.current.detectSnap(0);
    });
    expect(result.current.currentSide.current).toBe('left');

    act(() => {
      result.current.resetSnap();
    });

    expect(result.current.currentSide.current).toBeNull();
    expect(setSnapPreview).toHaveBeenCalledWith(null);
  });
});
