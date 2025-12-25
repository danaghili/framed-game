import { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import DragHandle from './DragHandle'
import { useSwipeGesture } from '../../hooks/useSwipeGesture'

/**
 * Full-screen modal that slides up from bottom
 * Supports swipe-down to close
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title: string
 * - children: ReactNode
 * - showDragHandle: boolean (default true)
 * - stickyFooter: ReactNode (optional action buttons)
 */
const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  showDragHandle = true,
  stickyFooter
}) => {
  const sheetRef = useRef(null)
  const { dragOffset, handlers } = useSwipeGesture({
    onSwipeDown: onClose,
    threshold: 100
  })

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-gray-900
                   rounded-t-2xl max-h-[90vh] flex flex-col
                   shadow-2xl"
        style={{
          transform: `translateY(${Math.max(0, dragOffset)}px)`,
          transition: dragOffset > 0 ? 'none' : 'transform 300ms ease-out'
        }}
        onClick={e => e.stopPropagation()}
        {...handlers}
      >
        {/* Drag Handle */}
        {showDragHandle && <DragHandle />}

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white touch-target"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-momentum p-4">
          {children}
        </div>

        {/* Sticky Footer (optional) */}
        {stickyFooter && (
          <div className="px-4 py-3 border-t border-gray-700 safe-area-bottom bg-gray-900">
            {stickyFooter}
          </div>
        )}
      </div>
    </div>
  )
}

export default BottomSheet
