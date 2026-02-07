# 🐱 MaoMao Core

**A High-Performance Window Management System for React.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2F19-61dafb.svg)](https://reactjs.org/)

MaoMao Core is a headless-first, stylable window manager library that brings a Desktop Experience to the web. It is engineered for **60FPS performance** using direct DOM manipulation for physics interactions while maintaining React's declarative state for window lifecycle management.

---

## ✨ Features

*   **⚡ Zero-Lag Physics**: Dragging and resizing bypass the React render cycle, directly manipulating DOM for 60FPS smoothness.
*   **🧲 Window Snapping**: Windows 11-style snap layouts (split screen left/right) with visual preview indicators.
*   **📱 Responsive Toolbar**: A dynamic Dock/Taskbar that adapts from a desktop dock to a mobile-friendly drawer.
*   **🧠 Optimized State**: Uses Context Splitting (`State` vs `Dispatch`) to minimize re-renders.
*   **🔌 Stylable Architecture**: Comes with a base CSS theme that can be easily customized or overridden.
*   **🧘‍♂️ TypeScript Native**: Built with strict typing for a robust developer experience.

---

## 🚀 Quick Start

Integrate a full Desktop environment in 3 steps.

### 1. Install & Import Styles

```bash
npm install @maomaolabs/core
```

Import the core styles in your root file (usually `main.tsx` or `App.tsx`):

```tsx
import '@maomaolabs/core/style.css';
```

### 2. Define Your Apps
Create a list of available applications using the `WindowDefinition` type.

```tsx
// config/apps.tsx
import { WindowDefinition } from '@maomaolabs/core';

export const myApps: WindowDefinition[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: <span>💻</span>, 
    component: <div>Hello World</div>,
    initialSize: { width: 600, height: 400 }
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <span>⚙️</span>,
    component: <SettingsPage />
  }
];
```

### 3. Setup the Provider & Layout
Wrap your application root with `WindowStoreProvider`.

```tsx
// App.tsx
import { WindowStoreProvider, WindowManager, Toolbar } from '@maomaolabs/core';
import { myApps } from './config/apps';

export default function App() {
  return (
    <WindowStoreProvider>
      {/* 
         1. The Manager renders the active floating windows on top of everything.
         It has pointer-events: none by default, so background clicks pass through.
      */}
      <WindowManager />

      {/* 2. Your Background / Desktop Area */}
      <main className="desktop-background">
        <h1>My Web OS</h1>
      </main>

      {/* 3. The Dock / Toolbar for launching apps */}
      <Toolbar windowsOptions={myApps} />
    </WindowStoreProvider>
  );
}
```

---

## 📚 API Reference

### Components

#### `<WindowStoreProvider>`
The brain of the operation. Holds the state of all active windows (z-index, minimized status, position, snap state).
*   **Props**: `children: ReactNode`

#### `<WindowManager>`
The renderer. It subscribes to the `WindowStore` and renders the list of active windows.
*   **Behavior**:
    *   Sits at `z-index: 100`.
    *   Click-through overlay (only the windows themselves capture clicks).

#### `<Toolbar>`
A responsive Dock component.
*   **Props**:
    *   `windowsOptions`: `WindowDefinition[]` - The list of apps the user can launch.
*   **Behavior**:
    *   **Desktop**: Renders a dock at the bottom.
    *   **Mobile**: Renders a simplified drawer/FAB button with optimized touch targets.

### Hooks

#### `useWindowActions()`
**Recommended**. Returns functions to control windows **without** subscribing to state changes. Use this to avoid unnecessary re-renders in components that just need to open/close windows.
```tsx
const { openWindow, closeWindow, minimize, maximize } = useWindowActions();
```

#### `useWindows()`
Returns the array of currently active `WindowInstance` objects. Use this if you need to build a custom taskbar or window list.
```tsx
const windows = useWindows();
// windows = [{ id: 'terminal', title: 'Terminal', isSnapped: true, ... }]
```

---

## 🛠 Type Definitions

### `WindowDefinition` (Configuration)
The static definition of an application in your system.

```typescript
type WindowDefinition = {
  id: string;               // Unique ID
  title: string;            // Window Title
  icon?: React.ReactNode;   // Icon (SVG/Emoji/Component)
  component: React.ReactNode; // The content content
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
}
```

### `WindowInstance` (Runtime State)
The active state of a window. Extends `WindowDefinition`.

```typescript
type WindowInstance = {
  // ...WindowDefinition types
  zIndex: number;
  isMinimized?: boolean;
  isMaximized?: boolean;
  isSnapped?: boolean;
  size: { width: number; height: number };
  position: { x: number; y: number };
}
```

---

## ⚙️ Architecture & Performance

### The "Hybrid State" Model
One of the biggest challenges in web-based window managers is performance. React's render cycle is too slow for 60FPS dragging and resizing.

MaoMao Core solves this with a **Hybrid Engine**:

1.  **Macro State (React)**:
    *   Lifecycle (open/close)
    *   Z-indexing & Focus
    *   Min/Max & Snap Status (`isSnapped`)
    *   *Managed by `WindowStore`.*

2.  **Micro Physics (DOM)**:
    *   Dragging (x/y coordinates)
    *   Resizing (width/height)
    *   Snap Preview Calculations
    *   *Managed by `useWindowStatus` hook.*

**How it works:**
When you drag a window, the library **bypasses React** and directly updates the `div.style.transform`. Only when you release the mouse (`mouseup`) does it sync the final position back to React state. This ensures butter-smooth window movement even if the window contains heavy components (like Data Grids or Maps).

---

## 🎨 Styling

The library uses **CSS Modules** effectively, but exposes a global `style.css` for base structural styles.

To customize the look:
1.  **Override CSS Variables**: Check `dist/style.css` for available variables.
2.  **Global Overrides**: Target classes like `.window-container`, `.window-header`, etc.

---

## 📄 License

MIT © MaoMao Labs
