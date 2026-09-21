"use client"

import { useCallback, useEffect, useState } from "react"

export function useScrollPadding() {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [hasVerticalOverflow, setHasVerticalOverflow] = useState(false)
  const ref = useCallback((node: HTMLDivElement | null) => setElement(node), [])

  useEffect(() => {
    if (!element) return

    const update = () =>
      setHasVerticalOverflow(element.scrollHeight > element.clientHeight)
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    update()
    return () => observer.disconnect()
  }, [element])

  return { hasVerticalOverflow, ref }
}
