const ActionPanel = ({
  selectedAction,
  onActionChange,
  hasForensicsKit,
  forensicsUsesLeft,
  hasMasterKey,
  blockedRoomsCount,
  gameOver
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => onActionChange('search')}
        disabled={gameOver}
        className={`py-3 rounded-lg font-bold text-sm ${
          selectedAction === 'search'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        } ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        SEARCH
      </button>
      <button
        onClick={() => onActionChange('examine')}
        disabled={gameOver || !hasForensicsKit || forensicsUsesLeft <= 0}
        className={`py-3 rounded-lg font-bold text-sm ${
          selectedAction === 'examine'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        } ${(gameOver || !hasForensicsKit || forensicsUsesLeft <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        EXAMINE {hasForensicsKit ? `(${forensicsUsesLeft})` : '[locked]'}
      </button>
      <button
        onClick={() => onActionChange('block')}
        disabled={gameOver || !hasMasterKey || blockedRoomsCount > 0}
        className={`py-3 rounded-lg font-bold text-sm ${
          selectedAction === 'block'
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        } ${(gameOver || !hasMasterKey || blockedRoomsCount > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        BLOCK {hasMasterKey ? (blockedRoomsCount > 0 ? '(USED)' : '(1)') : '[locked]'}
      </button>
    </div>
  )
}

export default ActionPanel
