import { Home, BookOpen, Search, ClipboardList, Menu } from 'lucide-react'

/**
 * Bottom navigation bar for mobile
 * Fixed to bottom of screen in thumb-zone
 *
 * Props:
 * - activeTab: 'map' | 'evidence' | 'search' | 'board' | 'menu'
 * - onTabChange: (tab: string) => void
 * - disabled?: boolean (during animations, etc)
 */

const NAV_ITEMS = [
  { id: 'map', icon: Home, label: 'Map' },
  { id: 'evidence', icon: BookOpen, label: 'Evidence' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'board', icon: ClipboardList, label: 'Board' },
  { id: 'menu', icon: Menu, label: 'More' }
]

const MobileNav = ({ activeTab, onTabChange, disabled = false }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40
                    bg-gray-900 border-t border-gray-700
                    safe-area-bottom">
      <div className="flex justify-around">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => ( // eslint-disable-line no-unused-vars
          <button
            key={id}
            onClick={() => !disabled && onTabChange(id)}
            disabled={disabled}
            className={`flex flex-col items-center py-2 px-4 min-w-[64px]
                       transition-colors touch-active no-select ${
                         activeTab === id
                           ? 'text-amber-500'
                           : 'text-gray-400'
                       } ${disabled ? 'opacity-50' : ''}`}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
