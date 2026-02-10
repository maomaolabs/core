import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDrag } from '../useWindow/useDrag';

describe('useDrag', () => {
  let windowRef: any;
  const onMove = vi.fn();
  const onSnapCheck = vi.fn();
  const size = { width: 100, height: 100 };
  const position = { x: 0, y: 0 };

  beforeEach(() => {
    windowRef = {
      current: {
        style: { left: '', top: '' }
      }
    };
    vi.clearAllMocks();
    global.innerWidth = 1000;
    global.innerHeight = 800;
  });

  it('should initialize not dragging', () => {
    const { result } = renderHook(() => useDrag(size, position, windowRef, onMove));
    expect(result.current.isDragging.current).toBe(false);
  });

  it('should start dragging', () => {
    const { result } = renderHook(() => useDrag(size, position, windowRef, onMove));
    const event = { clientX: 10, clientY: 10 } as React.MouseEvent;

    act(() => {
      result.current.startDrag(event);
    });

    expect(result.current.isDragging.current).toBe(true);
  });

  it('should update position on drag', () => {
    const { result } = renderHook(() => useDrag(size, position, windowRef, onMove));
    const startEvent = { clientX: 10, clientY: 10 } as React.MouseEvent;

    act(() => {
      result.current.startDrag(startEvent);
    });

    const moveEvent = { clientX: 20, clientY: 20 } as MouseEvent;
    act(() => {
      result.current.dragTo(moveEvent);
    });

    expect(windowRef.current.style.left).toBe('10px');
    expect(windowRef.current.style.top).toBe('10px');
    expect(onMove).toHaveBeenCalledWith({ x: 10, y: 10 });
  });

  it('should respect boundaries', () => {
    const { result } = renderHook(() => useDrag(size, position, windowRef, onMove));

    act(() => {
      result.current.startDrag({ clientX: 0, clientY: 0 } as React.MouseEvent);
    });

    const farEvent = { clientX: 2000, clientY: 0 } as MouseEvent;
    act(() => {
      result.current.dragTo(farEvent);
    });

    expect(windowRef.current.style.left).toBe('900px');
    expect(onMove).toHaveBeenCalledWith({ x: 900, y: 0 });
  });

  it('should call onSnapCheck if provided', () => {
    const { result } = renderHook(() => useDrag(size, position, windowRef, onMove, onSnapCheck));

    act(() => {
      result.current.startDrag({ clientX: 0, clientY: 0 } as React.MouseEvent);
    });

    act(() => {
      result.current.dragTo({ clientX: 50, clientY: 50 } as MouseEvent);
    });

    expect(onSnapCheck).toHaveBeenCalledWith(50);
  });
});
