import { useEffect, useRef } from "react"

type WindowPreviewProps = {
  windowId: string
}

export default function WindowPreview({ windowId }: WindowPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const source = getSourceWindow(windowId)
    if (!source) {
      container.replaceChildren()
      return
    }
    const clone = createSanitizedClone(source)
    container.replaceChildren(clone)
  }, [windowId])

  return <div ref={containerRef} className="window-preview-container" />
}

/**
 * Centralized lookup for the source window element.
 * Prevents magic strings and duplicated DOM access logic.
 */
function getSourceWindow(windowId: string): HTMLElement | null {
  const element = document.getElementById(`window-${windowId}`)
  return element instanceof HTMLElement ? element : null
}

/**
 * Creates a deep clone of the source element and applies
 * all required sanitization for preview rendering.
 */
function createSanitizedClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement
  sanitizeElementTree(clone)
  return clone
}

/**
 * Sanitizes the entire element tree so it can be safely rendered
 * outside of its original layout and DOM context.
 */
function sanitizeElementTree(root: HTMLElement) {
  root.removeAttribute("id")
  root.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"))

  applyForcedStyles(root)

  const scrollContainer = root.querySelector<HTMLElement>(".window-scrollbar")
  if (scrollContainer) scrollContainer.style.setProperty("display", "flex", "important")
}

/**
 * Applies a minimal set of forced styles required
 * to neutralize layout, transform and stacking issues.
 */
function applyForcedStyles(element: HTMLElement) {
  const styles: Record<string, string> = {
    display: "flex",
    position: "static",
    transform: "none",
    opacity: "1",
    width: "100%",
    height: "100%",
    minHeight: "0",
    visibility: "visible",
    zIndex: "auto",
    boxShadow: "none",
  }

  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(property, value, "important")
  }
}
