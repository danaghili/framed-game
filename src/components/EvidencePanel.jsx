const EvidencePanel = ({ clues, onShowEvents }) => {
  return (
    <div className="bg-gray-800 border-2 border-blue-600 rounded-lg p-4 flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-blue-400">Your Evidence ({clues.length})</h3>
        <button
          onClick={onShowEvents}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs font-bold"
        >
          Events
        </button>
      </div>
      <div className="space-y-2 overflow-y-auto flex-1">
        {[...clues].reverse().map((clue, idx) => (
          <div
            key={idx}
            className={`text-xs p-2 rounded ${
              clue.includes('PLANTED') ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {clue}
          </div>
        ))}
        {clues.length === 0 && (
          <div className="text-xs text-gray-500 italic text-center py-8">
            No evidence collected yet. Search rooms to find clues!
          </div>
        )}
      </div>
    </div>
  )
}

export default EvidencePanel
