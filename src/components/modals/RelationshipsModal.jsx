import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'

const RelationshipsModal = ({ suspects, relationships, relationshipTypes, onClose }) => {
  const isMobile = useIsMobile()

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="RELATIONSHIP NETWORK"
      size="xl"
      borderColor="border-green-600"
    >
      <div className="mb-4 bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          Understanding relationships between suspects is crucial for uncovering conspiracies.
          Strong connections suggest people who might work together.
        </p>
      </div>

      {/* Relationship Grid */}
      <div className="space-y-4">
        {suspects.map(suspect => {
          const suspectRelationships = relationships[suspect]
          return (
            <div key={suspect} className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">{suspect}</h3>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
    </ResponsiveModal>
  )
}

export default RelationshipsModal
