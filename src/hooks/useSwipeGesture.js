import { useState, useCallback, useRef } from 'react'

/**
 * Detects swipe gestures on touch devices
 *
 * Options:
 * - onSwipeDown: () => void
 * - onSwipeUp: () => void
 * - onSwipeLeft: () => void
 * - onSwipeRight: () => void
 * - threshold: number (px to trigger, default 50)
 *
 * Returns:
 * - dragOffset: number (current drag distance)
 * - isDragging: boolean
 * - handlers: { onTouchStart, onTouchMove, onTouchEnd }
 */
export function useSwipeGesture({
  onSwipeDown,
  onSwipeUp,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50
} = {}) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const startX = useRef(0)
  const currentDragOffset = useRef(0)

  const handleTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return

    const deltaY = e.touches[0].clientY - startY.current
    const deltaX = e.touches[0].clientX - startX.current

    // For vertical swipes (sheets), track Y offset
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Only allow dragging down (positive deltaY)
      if (onSwipeDown && deltaY > 0) {
        currentDragOffset.current = deltaY
        setDragOffset(deltaY)
      } else if (onSwipeUp && deltaY < 0) {
        currentDragOffset.current = Math.abs(deltaY)
        setDragOffset(Math.abs(deltaY))
      }
    } else {
      // Horizontal swipes
      if (onSwipeLeft && deltaX < 0) {
        currentDragOffset.current = Math.abs(deltaX)
      } else if (onSwipeRight && deltaX > 0) {
        currentDragOffset.current = deltaX
      }
    }
  }, [isDragging, onSwipeDown, onSwipeUp, onSwipeLeft, onSwipeRight])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)

    const deltaY = currentDragOffset.current
    const deltaX = startX.current !== 0 ? currentDragOffset.current : 0

    if (deltaY > threshold && onSwipeDown) {
      onSwipeDown()
    } else if (deltaY > threshold && onSwipeUp) {
      onSwipeUp()
    } else if (deltaX > threshold && onSwipeLeft) {
      onSwipeLeft()
    } else if (deltaX > threshold && onSwipeRight) {
      onSwipeRight()
    }

    setDragOffset(0)
    currentDragOffset.current = 0
  }, [threshold, onSwipeDown, onSwipeUp, onSwipeLeft, onSwipeRight])

  return {
    dragOffset,
    isDragging,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}
