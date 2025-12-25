import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useIsMobile } from '../../hooks/useIsMobile'
import BottomSheet from '../mobile/BottomSheet'

/**
 * Wrapper that renders BottomSheet on mobile, centered modal on desktop
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title: string
 * - children: ReactNode
 * - size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' (desktop only)
 * - stickyFooter?: ReactNode
 * - borderColor?: string (desktop border color class)
 */

const DESKTOP_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl'
}

const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  stickyFooter,
  borderColor = 'border-gray-600'
}) => {
  const isMobile = useIsMobile()

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen && !isMobile) {
      document.body.style.overflow = 'hidden'
    } else if (!isMobile) {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isMobile])

  if (!isOpen) return null

  // Mobile: Use BottomSheet
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        stickyFooter={stickyFooter}
      >
        {children}
      </BottomSheet>
    )
  }

  // Desktop: Centered modal
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-gray-800 rounded-lg w-full ${DESKTOP_SIZES[size]}
                   max-h-[90vh] flex flex-col shadow-xl border-4 ${borderColor}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors touch-target"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer (optional) */}
        {stickyFooter && (
          <div className="px-6 py-4 border-t border-gray-700">
            {stickyFooter}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResponsiveModal
