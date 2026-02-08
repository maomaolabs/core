import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useWindowManager } from '../useWindowManager';
import { WindowInstance } from '../../types';

// Mock Z_INDEX_LAYERS constant if needed, or rely on actual implementation
// Since the hook imports it, we should test with the real values unless specific mocking needed.
// However, the hook uses MOBILE_BREAKPOINT and window.innerWidth, let's mock resize if needed.

describe('useWindowManager', () => {
  const mockWindow: WindowInstance = {
    id: 'test-1',
    title: 'Test Window',
    component: null,
    zIndex: 0,
    layer: 'normal',
  };

  it('should initialize with empty windows', () => {
    const { result } = renderHook(() => useWindowManager());
    expect(result.current.windows).toHaveLength(0);
  });

  it('should open a window', () => {
    const { result } = renderHook(() => useWindowManager());

    act(() => {
      result.current.openWindow(mockWindow);
    });

    expect(result.current.windows).toHaveLength(1);
    expect(result.current.windows[0].id).toBe('test-1');
  });

  it('should close a window', () => {
    const { result } = renderHook(() => useWindowManager());

    act(() => {
      result.current.openWindow(mockWindow);
    });
    expect(result.current.windows).toHaveLength(1);

    act(() => {
      result.current.closeWindow('test-1');
    });
    expect(result.current.windows).toHaveLength(0);
  });

  it('should focus window and update z-index', () => {
    const { result } = renderHook(() => useWindowManager());

    // Open two windows
    const window1 = { ...mockWindow, id: 'w1', title: 'Window 1' };
    const window2 = { ...mockWindow, id: 'w2', title: 'Window 2' };

    act(() => {
      result.current.openWindow(window1);
    });
    act(() => {
      result.current.openWindow(window2);
    });

    // Initial state: w2 should be on top of w1
    // implementation details: base normal layer is 100.
    // w1 gets 100 or 101? implementation says: getNextZ
    // let's just check relative order or max zIndex

    const initialW1 = result.current.windows.find(w => w.id === 'w1');
    const initialW2 = result.current.windows.find(w => w.id === 'w2');

    expect(initialW2!.zIndex).toBeGreaterThan(initialW1!.zIndex);

    // Focus w1
    act(() => {
      result.current.focusWindow('w1');
    });

    const finalW1 = result.current.windows.find(w => w.id === 'w1');
    const finalW2 = result.current.windows.find(w => w.id === 'w2');

    expect(finalW1!.zIndex).toBeGreaterThan(finalW2!.zIndex);
  });

  /*
  it('should respect layers', () => {
    const { result } = renderHook(() => useWindowManager());

    const normalWindow = { ...mockWindow, id: 'normal', layer: 'normal' as const };
    const topWindow = { ...mockWindow, id: 'top', layer: 'alwaysOnTop' as const };

    act(() => {
      // Open alwaysOnTop first
      result.current.openWindow(topWindow);
    });
    act(() => {
      // Then open normal
      result.current.openWindow(normalWindow);
    });

    // Focusing normal window should NOT bring it above alwaysOnTop
    act(() => {
      result.current.focusWindow('normal');
    });

    const wNormal = result.current.windows.find(w => w.id === 'normal');
    const wTop = result.current.windows.find(w => w.id === 'top');

    // Expected: top > normal even after focus
    expect(wTop!.zIndex).toBeGreaterThan(wNormal!.zIndex);
    // Specifically, normal should be ~100 range, top ~1000 range
    expect(wTop!.zIndex).toBeGreaterThanOrEqual(1000);
    expect(wNormal!.zIndex).toBeLessThan(1000);
  });
  */
});
