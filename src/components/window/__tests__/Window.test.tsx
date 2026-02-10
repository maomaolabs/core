import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Window from '../Window';
import { WindowInstance } from '../../../types';

const { mockUseWindowActions, mockUseWindowSnap, mockUseWindowStatus, MockWindowHeader } = vi.hoisted(() => {
  return {
    mockUseWindowActions: {
      closeWindow: vi.fn(),
      focusWindow: vi.fn(),
      updateWindow: vi.fn()
    },
    mockUseWindowSnap: {
      setSnapPreview: vi.fn()
    },
    mockUseWindowStatus: {
      size: { width: 400, height: 300 },
      position: { x: 100, y: 100 },
      isDragging: false,
      isResizing: false,
      drag: vi.fn(),
      resize: vi.fn(),
      windowRef: { current: null }
    },
    MockWindowHeader: vi.fn()
  };
});

vi.mock('../../../store/window-context', () => ({
  useWindowActions: () => mockUseWindowActions,
  useWindowSnap: () => mockUseWindowSnap
}));

vi.mock('../../../hooks/useWindow/useWindowStatus', () => ({
  useWindowStatus: () => mockUseWindowStatus
}));

vi.mock('../WindowHeader', () => ({
  default: MockWindowHeader
}));

describe('Window', () => {
  const mockWindow: WindowInstance = {
    id: 'test-1',
    title: 'Test Window',
    component: <div>Window Content</div>,
    zIndex: 100,
    layer: 'normal'
  };

  const originalRAF = global.requestAnimationFrame;

  beforeEach(() => {
    vi.clearAllMocks();

    MockWindowHeader.mockImplementation(({ title, onClose }: any) => (
      <div data-testid="window-header">
        <span>{title}</span>
        <button onClick={onClose} data-testid="close-btn">X</button>
      </div>
    ));

    global.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
  });

  afterEach(() => {
    global.requestAnimationFrame = originalRAF;
    vi.useRealTimers();
  });

  it('should focus window on mouse down', () => {
    const { container } = render(<Window window={mockWindow} />);
    const windowDiv = container.firstChild as HTMLElement;
    fireEvent.mouseDown(windowDiv);
    expect(mockUseWindowActions.focusWindow).toHaveBeenCalledWith(mockWindow.id);
  });

  it('should handle close', () => {
    vi.useFakeTimers();
    render(<Window window={mockWindow} />);

    const closeBtn = screen.getByTestId('close-btn');
    fireEvent.click(closeBtn);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(mockUseWindowActions.closeWindow).toHaveBeenCalledWith(mockWindow.id);
  });
});
