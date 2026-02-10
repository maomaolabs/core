import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useIsMobile from '../useIsMobile';

describe('useIsMobile', () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false by default (desktop)', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('should return true if media query matches', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should handle breakpoint changes', () => {
    const { result } = renderHook(() => useIsMobile(1024));
    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 1024px)');
  });
});
