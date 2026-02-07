
import React from 'react';

/**
 * WindowDefinition type.
 * Defines the properties of a window.
 */


export type WindowDefinition = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
}

export type FolderDefinition = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  apps: WindowDefinition[];
}

export type ToolbarItem = WindowDefinition | FolderDefinition;

/**
 * WindowInstance type.
 * Defines the properties of a window instance.
 */
export type WindowInstance = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  size?: { width: number; height: number };
  position?: { x: number; y: number };
  isMinimized?: boolean;
  isMaximized?: boolean;
  isSnapped?: boolean;
  zIndex: number;
  component: React.ReactNode;
}

/**
 * WindowStore type.
 * Defines the properties of the window store.
 */
export type WindowStore = {
  windows: WindowInstance[];
  snapPreview: { side: 'left' | 'right' } | null;
  setSnapPreview: (preview: { side: 'left' | 'right' } | null) => void;
  openWindow: (window: WindowInstance) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindow: (id: string, data: Partial<WindowInstance>) => void;
};

export type WindowProps = {
  window: WindowInstance
}

export type WindowHeaderProps = {
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
}

export type WindowContextState = {
  size: { width: number; height: number }
  position: { x: number; y: number }
  isDragging: boolean
  isResizing: boolean
  drag: (e: React.MouseEvent) => void
  resize: (e: React.MouseEvent) => void
  isMinimized: boolean
  isMaximized: boolean
  isSnapped: boolean
  minimize: () => void
  maximize: () => void
  restore: () => void
  windowRef: React.RefObject<HTMLDivElement>
}
