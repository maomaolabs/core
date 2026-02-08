import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWindowStatus } from '../useWindow/useWindowStatus';

describe('useWindowStatus', () => {
  const props = {
    isMinimized: false,
    isMaximized: false,
    initialSize: { width: 400, height: 300 },
    initialPosition: { x: 100, y: 100 }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with provided size and position', () => {
    const { result } = renderHook(() => useWindowStatus(props));

    expect(result.current.size).toEqual(props.initialSize);
    expect(result.current.position).toEqual(props.initialPosition);
    expect(result.current.isDragging).toBe(false);
    expect(result.current.isResizing).toBe(false);
  });

  // Validating that startDrag sets state. proper drag logic is tested in useDrag
  it('should handle drag start', () => {
    const { result } = renderHook(() => useWindowStatus(props));
    const event = { clientX: 150, clientY: 150 } as React.MouseEvent;

    act(() => {
      result.current.drag(event);
    });

    expect(result.current.isDragging).toBe(true);
  });

  it('should handle resize start', () => {
    const { result } = renderHook(() => useWindowStatus(props));
    const event = { clientX: 150, clientY: 150 } as React.MouseEvent;

    act(() => {
      result.current.resize(event);
    });

    expect(result.current.isResizing).toBe(true);
  });
});
