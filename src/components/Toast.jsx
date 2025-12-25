import { useEffect, useState } from 'react'
import { X, Search, FileText, Package, AlertCircle } from 'lucide-react'

const TOAST_ICONS = {
  search: Search,
  document: FileText,
  item: Package,
  info: AlertCircle
}

const TOAST_COLORS = {
  search: 'bg-blue-900 border-blue-500 text-blue-100',
  document: 'bg-yellow-900 border-yellow-500 text-yellow-100',
  item: 'bg-green-900 border-green-500 text-green-100',
  info: 'bg-gray-800 border-gray-500 text-gray-100'
}

const Toast = ({ id, type = 'info', title, message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false)
  const Icon = TOAST_ICONS[type] || AlertCircle
  const colorClass = TOAST_COLORS[type] || TOAST_COLORS.info

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onDismiss(id), 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [id, onDismiss])

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => onDismiss(id), 300)
  }

  return (
    <div
      className={`
        ${colorClass} border-l-4 rounded-r-lg shadow-lg p-3 mb-2
        flex items-start gap-3 min-w-[280px] max-w-[360px]
        transform transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <div className="font-bold text-sm">{title}</div>}
        {message && <div className="text-xs opacity-90 mt-0.5">{message}</div>}
      </div>
      <button
        onClick={handleDismiss}
        className="text-white/50 hover:text-white p-1 -mr-1 -mt-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  )
}

export default Toast
