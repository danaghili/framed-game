import { useState, useCallback, useRef } from 'react'

/**
 * Handles pinch-to-zoom and pan gestures
 *
 * Options:
 * - minZoom: number (default 1)
 * - maxZoom: number (default 3)
 * - initialZoom: number (default 1)
 *
 * Returns:
 * - zoom: number
 * - position: { x: number, y: number }
 * - handlers: touch event handlers
 * - resetZoom: () => void
 */
export function usePinchZoom({
  minZoom = 1,
  maxZoom = 3,
  initialZoom = 1
} = {}) {
  const [zoom, setZoom] = useState(initialZoom)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const lastDistance = useRef(0)
  const lastPosition = useRef({ x: 0, y: 0 })
  const isPinching = useRef(false)
  const isPanning = useRef(false)

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      // Pinch start
      isPinching.current = true
      lastDistance.current = getDistance(e.touches)
    } else if (e.touches.length === 1 && zoom > 1) {
      // Pan start (only when zoomed)
      isPanning.current = true
      lastPosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      }
    }
  }, [zoom, position])

  const handleTouchMove = useCallback((e) => {
    if (isPinching.current && e.touches.length === 2) {
      const distance = getDistance(e.touches)
      const scale = distance / lastDistance.current

      setZoom(prev => {
        const newZoom = prev * scale
        return Math.min(maxZoom, Math.max(minZoom, newZoom))
      })

      lastDistance.current = distance
    } else if (isPanning.current && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - lastPosition.current.x,
        y: e.touches[0].clientY - lastPosition.current.y
      })
    }
  }, [minZoom, maxZoom])

  const handleTouchEnd = useCallback(() => {
    isPinching.current = false
    isPanning.current = false
  }, [])

  const handleDoubleClick = useCallback(() => {
    // Toggle between 1x and 2x zoom
    if (zoom === 1) {
      setZoom(2)
    } else {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [zoom])

  const resetZoom = useCallback(() => {
    setZoom(initialZoom)
    setPosition({ x: 0, y: 0 })
  }, [initialZoom])

  return {
    zoom,
    position,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onDoubleClick: handleDoubleClick
    },
    resetZoom
  }
}
