import { useState, useRef, useEffect } from 'react'
import { Target, BookOpen, ClipboardList, Menu, ChevronDown, Users, Network, UserSearch, MessageSquare, Clock, FileText, FolderOpen } from 'lucide-react'

/**
 * Desktop Action Bar
 * Replaces 8-button grids with organized dropdown menus
 */

const DropdownItem = ({ icon: Icon, label, onClick, disabled = false, badge = null }) => ( // eslint-disable-line no-unused-vars
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
      disabled
        ? 'text-gray-500 cursor-not-allowed'
        : 'text-gray-200 hover:bg-gray-600'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="flex-1">{label}</span>
    {badge && (
      <span className="text-xs bg-gray-600 px-2 py-0.5 rounded">{badge}</span>
    )}
  </button>
)

const DropdownSection = ({ title, children }) => (
  <div className="py-2">
    <div className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
      {title}
    </div>
    {children}
  </div>
)

const Dropdown = ({ isOpen, onClose, children, align = 'left' }) => {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-1 ${align === 'right' ? 'right-0' : 'left-0'}
                  bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 min-w-[200px]`}
    >
      {children}
    </div>
  )
}

const ActionButton = ({ icon: Icon, label, onClick, variant = 'default', hasDropdown = false, isActive = false }) => { // eslint-disable-line no-unused-vars
  const variants = {
    default: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
    danger: 'bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-600',
    primary: 'bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-400 border border-indigo-600'
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${variants[variant]} ${isActive ? 'ring-2 ring-white/30' : ''}`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {hasDropdown && <ChevronDown className={`w-3 h-3 transition-transform ${isActive ? 'rotate-180' : ''}`} />}
    </button>
  )
}

const ActionBar = ({
  onAccuse,
  onOpenEvidence,
  onOpenDocuments,
  onOpenDeductions,
  onOpenDossiers,
  onOpenRelationships,
  onInterrogate,
  onOpenWitnesses,
  onOpenTimeline,
  onOpenEvents,
  interrogationsLeft = 0,
  gameOver = false
}) => {
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const handleAction = (action) => {
    setOpenDropdown(null)
    action()
  }

  return (
    <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-2">
      {/* Accuse Button */}
      <ActionButton
        icon={Target}
        label="ACCUSE"
        onClick={onAccuse}
        variant="danger"
      />

      {/* Evidence Dropdown */}
      <div className="relative">
        <ActionButton
          icon={BookOpen}
          label="EVIDENCE"
          onClick={() => toggleDropdown('evidence')}
          hasDropdown
          isActive={openDropdown === 'evidence'}
        />
        <Dropdown
          isOpen={openDropdown === 'evidence'}
          onClose={() => setOpenDropdown(null)}
        >
          <div className="py-1">
            <DropdownItem
              icon={BookOpen}
              label="Evidence Journal"
              onClick={() => handleAction(onOpenEvidence)}
            />
            <DropdownItem
              icon={FolderOpen}
              label="Documents"
              onClick={() => handleAction(onOpenDocuments)}
            />
          </div>
        </Dropdown>
      </div>

      {/* Deductions Button */}
      <ActionButton
        icon={ClipboardList}
        label="DEDUCTIONS"
        onClick={onOpenDeductions}
        variant="primary"
      />

      {/* More Dropdown */}
      <div className="relative">
        <ActionButton
          icon={Menu}
          label="MORE"
          onClick={() => toggleDropdown('more')}
          hasDropdown
          isActive={openDropdown === 'more'}
        />
        <Dropdown
          isOpen={openDropdown === 'more'}
          onClose={() => setOpenDropdown(null)}
          align="right"
        >
          <DropdownSection title="Suspects">
            <DropdownItem
              icon={Users}
              label="Dossiers"
              onClick={() => handleAction(onOpenDossiers)}
            />
            <DropdownItem
              icon={Network}
              label="Relationships"
              onClick={() => handleAction(onOpenRelationships)}
            />
            <DropdownItem
              icon={UserSearch}
              label="Interrogate"
              onClick={() => handleAction(onInterrogate)}
              disabled={interrogationsLeft === 0 || gameOver}
              badge={interrogationsLeft > 0 ? `${interrogationsLeft} left` : null}
            />
          </DropdownSection>

          <div className="border-t border-gray-600" />

          <DropdownSection title="Witnesses & Timeline">
            <DropdownItem
              icon={MessageSquare}
              label="Witness Statements"
              onClick={() => handleAction(onOpenWitnesses)}
            />
            <DropdownItem
              icon={Clock}
              label="Timeline Analysis"
              onClick={() => handleAction(onOpenTimeline)}
            />
          </DropdownSection>

          <div className="border-t border-gray-600" />

          <DropdownSection title="Case Notes">
            <DropdownItem
              icon={FileText}
              label="Events Log"
              onClick={() => handleAction(onOpenEvents)}
            />
          </DropdownSection>
        </Dropdown>
      </div>
    </div>
  )
}

export default ActionBar
