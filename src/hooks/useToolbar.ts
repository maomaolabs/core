'use client'

import { useState } from "react";

/**
 * useToolbar hook.
 * Encapsulates the logic to use in Toolbar.tsx
 * 
 * @returns {Object} The Toolbar context.
 */
export default function useToolbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return {
    isOpen,
    setIsOpen,
    toggleOpen,
  }
}
