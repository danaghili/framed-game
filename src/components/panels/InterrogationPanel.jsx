const InterrogationPanel = ({
  suspects,
  suspectProfiles,
  interrogated,
  interrogationsLeft,
  gameOver,
  onInterrogate
}) => {
  return (
    <div className="mt-4 bg-gray-700 border-2 border-green-600 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-green-400">Interrogate Suspects</h3>
        <div className="text-sm font-bold text-yellow-400">
          {interrogationsLeft} / 3 remaining
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {suspects.map(suspect => {
          const profile = suspectProfiles[suspect]
          const isInterrogated = interrogated.includes(suspect)
          const isDisabled = gameOver || isInterrogated || interrogationsLeft <= 0

          return (
            <button
              key={suspect}
              onClick={() => onInterrogate(suspect)}
              disabled={isDisabled}
              className={`p-3 rounded-lg text-left text-sm transition-all ${
                isDisabled
                  ? 'bg-gray-800 border-2 border-gray-600 opacity-60 cursor-not-allowed'
                  : 'bg-gray-600 border-2 border-green-500 hover:bg-gray-500 cursor-pointer'
              }`}
            >
              <div className="font-bold">{suspect}</div>
              <div className="text-xs text-gray-400 mt-1">{profile.occupation}</div>
              <div className="text-xs text-gray-400">{profile.location}</div>
              {isInterrogated && (
                <div className="text-xs text-green-400 mt-1">Interrogated</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default InterrogationPanel
