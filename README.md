# 🐱 MaoMao Core

**A High-Performance Window Management System for React.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2F19-61dafb.svg)](https://reactjs.org/)

MaoMao Core is a headless-first, stylable window manager library that brings a Desktop Experience to the web. It is engineered for **60FPS performance** using direct DOM manipulation for physics interactions while maintaining React's declarative state for window lifecycle management.

---

## ✨ Features

*   **⚡ Zero-Lag Physics**: Dragging and resizing bypass the React render cycle, directly manipulating DOM for 60FPS smoothness.
*   **📱 Responsive Design**: Includes a dedicated Mobile Toolbar and Desktop Dock with auto-detect logic.
*   **🧠 Optimized State**: Uses Context Splitting (`State` vs `Dispatch`) to minimize re-renders.
*   **🔌 Headless Arcitecture**: Components are unstyled by default (mostly), allowing for complete CSS customization via Modules.
*   **🧘‍♂️ TypeScript Native**: Built with strict typing for a robust developer experience.

---

## 📦 Installation

```bash
npm install @maomaolabs/core
# or
yarn add @maomaolabs/core
```

---

## 🚀 Quick Start

Integrate a full Desktop environment in 3 steps.

### 1. Define Your Apps
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

### 2. Setup the Provider & Layout
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
The brain of the operation. Holds the state of all active windows (z-index, minimized status, position).
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
    *   **Mobile**: Renders a simplified drawer/FAB button.

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
// windows = [{ id: 'terminal', title: 'Terminal', zIndex: 1, ... }]
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
  size: { width: number; height: number };
  position: { x: number; y: number };
}
```

---

## ⚙️ Architecture & Performance

### The "Hybid State" Model
One of the biggest challenges in web-based window managers is performance. React's render cycle is too slow for 60FPS dragging and resizing.

MaoMao Core solves this with a **Hybrid Engine**:

1.  **Macro State (React)**:
    *   lifecycle (open/close)
    *   z-indexing (stacking order)
    *   min/max status
    *   *Managed by `WindowStore`.*

2.  **Micro Physics (DOM)**:
    *   Dragging (x/y coordinates)
    *   Resizing (width/height)
    *   *Managed by `useWindowStatus` hook.*

**How it works:**
When you drag a window, the library **bypasses React** and directly updates the `div.style.transform`. Only when you release the mouse (`mouseup`) does it sync the final position back to React state. This ensures butter-smooth window movement even if the window contains heavy components (like Data Grids or Maps).

---

## 🎨 Styling

The library uses **CSS Modules** internally to prevent class name collisions.

*   **Structure**:
    *   `.window-container`: The main frame.
    *   `.window-header`: The top bar.
    *   `.window-content`: The scrollable area where your component lives.

To customize the look, you can override the styles globally or inspect the specific classes generated by the build. In future versions, a `theme` prop will be exposed for easier customization.

---

## 📄 License

MIT © MaoMao Labs
