const RelationshipsModal = ({ suspects, relationships, relationshipTypes, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-4 border-green-600 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-green-400">SUSPECT RELATIONSHIP NETWORK</h2>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-bold"
          >
            Close
          </button>
        </div>

        <div className="mb-4 bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-300">
            Understanding relationships between suspects is crucial for uncovering conspiracies.
            Pay attention to relationship types and strengths. Strong connections suggest people who might trust each other enough to commit murder together.
          </p>
        </div>

        {/* Relationship Grid - Scrollable */}
        <div className="space-y-4 overflow-y-auto flex-1">
          {suspects.map(suspect => {
            const suspectRelationships = relationships[suspect]
            return (
              <div key={suspect} className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-bold text-white mb-3">{suspect}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(suspectRelationships).map(([otherSuspect, relationshipType]) => {
                    const relType = relationshipTypes[relationshipType]
                    return (
                      <div
                        key={otherSuspect}
                        className="bg-gray-800 rounded p-3 border-2"
                        style={{ borderColor: relType.color }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{otherSuspect}</span>
                          <span
                            className="text-xs px-2 py-1 rounded font-bold"
                            style={{
                              backgroundColor: relType.color + '40',
                              color: relType.color
                            }}
                          >
                            {relType.strength}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{relType.description}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RelationshipsModal
