import { Users, Clock, MessageSquare, FileText, Network, UserSearch } from 'lucide-react'
import ResponsiveModal from '../responsive/ResponsiveModal'

const MenuButton = ({ icon: Icon, label, onClick, color = 'bg-gray-700' }) => ( // eslint-disable-line no-unused-vars
  <button
    onClick={onClick}
    className={`${color} hover:opacity-80 p-4 rounded-lg flex items-center gap-3 w-full text-left transition-all touch-active`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
)

const MenuSection = ({ title, children }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
      {title}
    </h3>
    <div className="space-y-2">
      {children}
    </div>
  </div>
)

const MoreMenuModal = ({
  onClose,
  onOpenDossiers,
  onOpenRelationships,
  onInterrogate,
  onOpenWitnesses,
  onOpenTimeline,
  onOpenEvents,
  interrogationsLeft = 0,
  gameOver = false
}) => {
  const handleAction = (action) => {
    onClose()
    action()
  }

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="INVESTIGATION"
      size="md"
      borderColor="border-gray-600"
    >
      {/* Suspects Section */}
      <MenuSection title="Suspects">
        <MenuButton
          icon={Users}
          label="Dossiers"
          onClick={() => handleAction(onOpenDossiers)}
          color="bg-blue-900/50"
        />
        <MenuButton
          icon={Network}
          label="Relationships"
          onClick={() => handleAction(onOpenRelationships)}
          color="bg-green-900/50"
        />
        <MenuButton
          icon={UserSearch}
          label={`Interrogate${interrogationsLeft > 0 ? ` (${interrogationsLeft} left)` : ''}`}
          onClick={() => handleAction(onInterrogate)}
          color={interrogationsLeft > 0 && !gameOver ? 'bg-purple-900/50' : 'bg-gray-800 opacity-50'}
        />
      </MenuSection>

      {/* Witnesses & Timeline Section */}
      <MenuSection title="Witnesses & Timeline">
        <MenuButton
          icon={MessageSquare}
          label="Witness Statements"
          onClick={() => handleAction(onOpenWitnesses)}
          color="bg-amber-900/50"
        />
        <MenuButton
          icon={Clock}
          label="Timeline Analysis"
          onClick={() => handleAction(onOpenTimeline)}
          color="bg-purple-900/50"
        />
      </MenuSection>

      {/* Case Notes Section */}
      <MenuSection title="Case Notes">
        <MenuButton
          icon={FileText}
          label="Events Log"
          onClick={() => handleAction(onOpenEvents)}
          color="bg-gray-700"
        />
      </MenuSection>
    </ResponsiveModal>
  )
}

export default MoreMenuModal
