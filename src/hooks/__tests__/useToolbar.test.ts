import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useToolbar from '../useToolbar';

describe('useToolbar', () => {
  it('should initialize as closed', () => {
    const { result } = renderHook(() => useToolbar());
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle state', () => {
    const { result } = renderHook(() => useToolbar());

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should set state directly', () => {
    const { result } = renderHook(() => useToolbar());

    act(() => {
      result.current.setIsOpen(true);
    });
    expect(result.current.isOpen).toBe(true);
  });
});
