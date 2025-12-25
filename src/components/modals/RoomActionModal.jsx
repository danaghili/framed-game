import { Search, Lock } from 'lucide-react'
import ResponsiveModal from '../responsive/ResponsiveModal'

/**
 * Modal shown when clicking a room and block action is available.
 * Lets player choose between searching or blocking the room.
 */
const RoomActionModal = ({ room, canBlock, onSearch, onBlock, onClose }) => {
  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title={room.toUpperCase()}
      size="sm"
      borderColor="border-blue-600"
    >
      <p className="text-gray-400 text-sm mb-4">
        What would you like to do in this room?
      </p>

      <div className="space-y-3">
        <button
          onClick={onSearch}
          className="w-full flex items-center gap-3 p-4 bg-blue-900/50 hover:bg-blue-800/50 border-2 border-blue-600 rounded-lg transition-all touch-active"
        >
          <Search className="w-6 h-6 text-blue-400" />
          <div className="text-left">
            <div className="font-bold text-white">Search Room</div>
            <div className="text-xs text-gray-400">Look for evidence and clues</div>
          </div>
        </button>

        {canBlock && (
          <button
            onClick={onBlock}
            className="w-full flex items-center gap-3 p-4 bg-red-900/50 hover:bg-red-800/50 border-2 border-red-600 rounded-lg transition-all touch-active"
          >
            <Lock className="w-6 h-6 text-red-400" />
            <div className="text-left">
              <div className="font-bold text-white">Block Room</div>
              <div className="text-xs text-gray-400">Prevent rival from entering (one-time use)</div>
            </div>
          </button>
        )}
      </div>
    </ResponsiveModal>
  )
}

export default RoomActionModal
