import { useEffect, useRef } from "react"

type WindowPreviewProps = {
  windowId: string
}

export default function WindowPreview({ windowId }: WindowPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const source = document.getElementById(`window-${windowId}`)
    if (!source) return

    while (container.firstChild) container.removeChild(container.firstChild)

    const clone = source.cloneNode(true)
    if (!(clone instanceof HTMLElement)) return

    sanitizeClone(clone)
    container.appendChild(clone)
  }, [windowId])

  return <div ref={containerRef} className="window-preview-container" />
}

function sanitizeClone(element: HTMLElement) {
  element.removeAttribute("id")

  element.style.setProperty("display", "flex", "important")
  element.style.setProperty("position", "static", "important")
  element.style.setProperty("transform", "none", "important")
  element.style.setProperty("opacity", "1", "important")
  element.style.setProperty("width", "100%", "important")
  element.style.setProperty("height", "100%", "important")
  element.style.setProperty("min-height", "0", "important")
  element.style.boxShadow = "none"
  element.style.zIndex = "auto"
  element.style.setProperty("visibility", "visible", "important")

  element.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"))

  const scrollContainer = element.querySelector(".window-scrollbar")
  if (scrollContainer instanceof HTMLElement) {
    scrollContainer.style.setProperty("display", "flex", "important")
  }
}
