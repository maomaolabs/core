import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useResize } from '../useWindow/useResize';
import { MIN_WIDTH, MIN_HEIGHT } from '../useWindow/constants';

describe('useResize', () => {
  let windowRef: any;
  const onResizeEnd = vi.fn(); 
  const size = { width: 500, height: 500 };

  beforeEach(() => {
    windowRef = {
      current: {
        style: { width: '', height: '' }
      }
    };
    vi.clearAllMocks();
  });

  it('should initialize not resizing', () => {
    const { result } = renderHook(() => useResize(size, windowRef, onResizeEnd));
    expect(result.current.isResizing.current).toBe(false);
  });

  it('should start resizing', () => {
    const { result } = renderHook(() => useResize(size, windowRef, onResizeEnd));
    const event = { clientX: 100, clientY: 100 } as React.MouseEvent;

    act(() => {
      result.current.startResize(event);
    });

    expect(result.current.isResizing.current).toBe(true);
  });

  it('should update size on resize', () => {
    const { result } = renderHook(() => useResize(size, windowRef, onResizeEnd));
    const startEvent = { clientX: 100, clientY: 100 } as React.MouseEvent;

    act(() => {
      result.current.startResize(startEvent);
    });

    const moveEvent = { clientX: 150, clientY: 150 } as MouseEvent;
    act(() => {
      result.current.resizeTo(moveEvent);
    });

    expect(windowRef.current.style.width).toBe('550px');
    expect(windowRef.current.style.height).toBe('550px');
    expect(onResizeEnd).toHaveBeenCalledWith({ width: 550, height: 550 });
  });

  it('should respect minimum dimensions', () => {
    const { result } = renderHook(() => useResize(size, windowRef, onResizeEnd));
    const startEvent = { clientX: 100, clientY: 100 } as React.MouseEvent;

    act(() => {
      result.current.startResize(startEvent);
    });

    const moveEvent = { clientX: -500, clientY: -500 } as MouseEvent;
    act(() => {
      result.current.resizeTo(moveEvent);
    });

    expect(windowRef.current.style.width).toBe(`${MIN_WIDTH}px`);
    expect(windowRef.current.style.height).toBe(`${MIN_HEIGHT}px`);
  });
});
