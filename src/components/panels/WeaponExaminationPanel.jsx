const WeaponExaminationPanel = ({
  weapons,
  weaponDetails,
  examinedWeapons,
  hasForensicsKit,
  forensicsUsesLeft,
  gameOver,
  onExamine
}) => {
  return (
    <div className="mt-4 bg-gray-700 border-2 border-purple-600 rounded-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-purple-400">Examine Weapons</h3>
        {hasForensicsKit && (
          <div className="text-sm font-bold text-yellow-400">
            {forensicsUsesLeft} / 5 uses left
          </div>
        )}
      </div>
      {!hasForensicsKit ? (
        <div className="text-sm text-gray-400 italic text-center py-8">
          Find the Forensics Kit to examine weapons
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {weapons.map(weapon => {
            const details = weaponDetails[weapon]
            const isExamined = examinedWeapons.includes(weapon)
            const isDisabled = gameOver || isExamined

            return (
              <button
                key={weapon}
                onClick={() => onExamine(weapon)}
                disabled={isDisabled}
                className={`p-3 rounded-lg text-left text-sm transition-all ${
                  isDisabled
                    ? 'bg-gray-800 border-2 border-gray-600 opacity-60 cursor-not-allowed'
                    : 'bg-gray-600 border-2 border-purple-500 hover:bg-gray-500 cursor-pointer'
                }`}
              >
                <div className="font-bold">{weapon}</div>
                <div className="text-xs text-gray-400 mt-1">{details.description}</div>
                {isExamined && (
                  <div className="text-xs text-purple-400 mt-1">Examined</div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WeaponExaminationPanel
