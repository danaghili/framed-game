import { Target, BookOpen, Search, ClipboardList, Menu } from 'lucide-react'

/**
 * Bottom navigation bar for mobile
 * Fixed to bottom of screen in thumb-zone
 *
 * Props:
 * - activeTab: 'accuse' | 'evidence' | 'search' | 'board' | 'menu'
 * - onTabChange: (tab: string) => void
 * - disabled?: boolean (during animations, etc)
 * - badges?: { [tabId]: number } - badge counts for each tab
 */

const NAV_ITEMS = [
  { id: 'accuse', icon: Target, label: 'Accuse' },
  { id: 'evidence', icon: BookOpen, label: 'Evidence' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'board', icon: ClipboardList, label: 'Board' },
  { id: 'menu', icon: Menu, label: 'More' }
]

const MobileNav = ({ activeTab, onTabChange, disabled = false, badges = {} }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40
                    bg-gray-900 border-t border-gray-700
                    safe-area-bottom">
      <div className="flex justify-around">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => { // eslint-disable-line no-unused-vars
          const badgeCount = badges[id] || 0
          return (
            <button
              key={id}
              onClick={() => !disabled && onTabChange(id)}
              disabled={disabled}
              className={`relative flex flex-col items-center py-2 px-4 min-w-[64px]
                         transition-colors touch-active no-select ${
                           activeTab === id
                             ? 'text-amber-500'
                             : 'text-gray-400'
                         } ${disabled ? 'opacity-50' : ''}`}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px]
                                   bg-red-500 text-white text-[10px] font-bold
                                   rounded-full flex items-center justify-center px-1">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
