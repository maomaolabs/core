# @maomaolabs/core

<div align="center">

**The React Window Manager for the Web OS Era.**

[![npm version](https://img.shields.io/npm/v/@maomaolabs/core.svg?style=flat-square)](https://www.npmjs.com/package/@maomaolabs/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@maomaolabs/core?style=flat-square)](https://bundlephobia.com/package/@maomaolabs/core)
[![Build Status](https://img.shields.io/github/actions/workflow/status/maomaolabs/core/ci.yml?style=flat-square)](https://github.com/maomaolabs/core/actions)

</div>

## 🚀 Why MaoMao Core?

Building a desktop-like experience on the web is hard. You have to handle z-index stacking, dragging constraints, resizing handles, mobile responsiveness, and state management. 

**MaoMao Core handles the chaos so you can focus on the apps.**

### ✨ Key Features

- **🖱️ Drag & Drop**: Smooth, performant window dragging with boundary constraints.
- **📐 Resizable**: Native-like resizing from all corners and edges.
- **🧲 Smart Snapping**: Drag to screen edges to snap (split-screen) just like Windows/macOS.
- **📱 Mobile Adaptive**: Automatically switches to a full-screen app switcher on mobile devices.
- **🎨 Headless-ish**: Comes with beautiful defaults but allows for full content customization.
- **🧠 Robust State Management**: Built-in context for window focus and stacking order (z-index).

---

## ⚡ Quick Start

### 1. Installation

```bash
npm install @maomaolabs/core
# or
yarn add @maomaolabs/core
# or
pnpm add @maomaolabs/core
```

### 2. The "Hello World" Setup

Wrap your app with the provider and add the necessary components.

```tsx
import React from 'react';
import { WindowStoreProvider, WindowManager, Toolbar, WindowDefinition } from '@maomaolabs/core';
import '@maomaolabs/core/dist/style.css'; // Don't forget CSS!

// Define your app
const myApps: WindowDefinition[] = [
  {
    id: 'hello-world',
    title: 'Hello App',
    icon: <span>👋</span>,
    component: <div>Hello World from a Window!</div>,
  }
];

function App() {
  return (
    <WindowStoreProvider>
      <div style={{ height: '100vh', width: '100vw', background: '#f0f0f0' }}>
        
        {/* The desktop area where windows live */}
        <WindowManager />
        
        {/* The dock/taskbar */}
        <Toolbar windowsOptions={myApps} />
        
      </div>
    </WindowStoreProvider>
  );
}
```

---

## 📖 Advanced Usage

### Architecture

MaoMao Core uses a **Context-based** architecture.
1. `WindowStoreProvider`: Holds the state of all open windows.
2. `WindowManager`: Renders the actual DOM elements for windows.
3. `Toolbar`: Provides the UI to open/toggle windows.

### Defining Windows (`WindowDefinition`)

You define your apps as simple objects.

```ts
type WindowDefinition = {
  id: string;              // Unique identifier
  title: string;          // Window title bar text
  icon?: React.ReactNode; // Icon for header and dock
  component: React.ReactNode; // The content of the window
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  layer?: 'base' | 'normal' | 'alwaysOnTop'; // Z-index grouping
};
```

### Controlling Windows Programmatically

You can control windows from *anywhere* inside the provider using the `useWindowActions` hook.

```tsx
import { useWindowActions } from '@maomaolabs/core';

function LaunchButton() {
  const { openWindow, closeWindow } = useWindowActions();

  const handleLaunch = () => {
    openWindow({
      id: 'dynamic-window',
      title: 'Dynamic',
      component: <MyComponent />
    });
  };

  return <button onClick={handleLaunch}>Launch App</button>;
}
```

---

## 🍳 Cookbook

### 1. Integration with Tailwind CSS

You can use Tailwind classes inside your window content components freely.

```tsx
const TailwindApp = {
  id: 'tailwind-demo',
  title: 'Tailwind App',
  component: (
    <div className="p-4 bg-white h-full">
      <h1 className="text-2xl font-bold text-blue-600">Tailwind Rules</h1>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Click Me
      </button>
    </div>
  )
};
```

### 2. Creating a Custom "Start Menu"

If the built-in `Toolbar` isn't enough, build your own launcher.

```tsx
import { useWindowActions } from '@maomaolabs/core';

export const MyStartMenu = ({ apps }) => {
  const { openWindow } = useWindowActions();

  return (
    <div className="my-start-menu">
      {apps.map(app => (
        <div key={app.id} onClick={() => openWindow(app)}>
          {app.icon} {app.title}
        </div>
      ))}
    </div>
  );
};
```

---

## 📚 API Reference

### `WindowStoreProvider`

Top-level provider component. Must wrap the application.

| Prop | Type | Description |
|------|------|-------------|
| children | `ReactNode` | Your application content. |

### `WindowManager`

Renders the active windows. Place this inside the provider, typically at the top level of your layout.

### `Toolbar`

The dock/taskbar component.

| Prop | Type | Description |
|------|------|-------------|
| windowsOptions | `WindowDefinition[]` | Array of available apps to display in the dock. |

---

## 🤝 Contribution & Roadmap

We are just getting started! Here is what's coming next:

- [ ] **Theming API**: Easier customization of window chrome colors.
- [ ] **Minimize Animations**: MacOS-style genie effect? Maybe!
- [ ] **Keyboard Shortcuts**: Alt+Tab support.

### Contributing

PRs are welcome! Please run the test suite before submitting:
```bash
npm run test
```

---

## 📝 License

MIT © [MaoMao Labs](https://github.com/maomaolabs)
