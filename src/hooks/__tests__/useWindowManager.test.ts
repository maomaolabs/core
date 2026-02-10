import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useWindowManager } from '../useWindowManager';
import { WindowInstance } from '../../types';

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

    const window1 = { ...mockWindow, id: 'w1', title: 'Window 1' };
    const window2 = { ...mockWindow, id: 'w2', title: 'Window 2' };

    act(() => {
      result.current.openWindow(window1);
    });
    act(() => {
      result.current.openWindow(window2);
    });

    const initialW1 = result.current.windows.find(w => w.id === 'w1');
    const initialW2 = result.current.windows.find(w => w.id === 'w2');

    expect(initialW2!.zIndex).toBeGreaterThan(initialW1!.zIndex);

    act(() => {
      result.current.focusWindow('w1');
    });

    const finalW1 = result.current.windows.find(w => w.id === 'w1');
    const finalW2 = result.current.windows.find(w => w.id === 'w2');

    expect(finalW1!.zIndex).toBeGreaterThan(finalW2!.zIndex);
  });

  it('should not update state if focusing an already focused window', () => {
    const { result } = renderHook(() => useWindowManager());
    const window1Id = 'w1';
    const window1 = { ...mockWindow, id: window1Id };

    act(() => {
      result.current.openWindow(window1);
    });

    const firstState = result.current.windows;

    act(() => {
      result.current.focusWindow(window1Id);
    });

    const secondState = result.current.windows;

    expect(secondState).toBe(firstState);
  });
});
