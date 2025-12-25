import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'
import { HelpCircle } from 'lucide-react'

const RelationshipsModal = ({ suspects, relationships, discoveredRelationships = {}, relationshipTypes, onClose }) => {
  const isMobile = useIsMobile()

  // Helper to check if relationship is discovered
  const isDiscovered = (suspect1, suspect2) => {
    const key = [suspect1, suspect2].sort().join('-')
    return discoveredRelationships[key] !== undefined
  }

  // Helper to get discovered relationship type
  const getDiscoveredType = (suspect1, suspect2) => {
    const key = [suspect1, suspect2].sort().join('-')
    return discoveredRelationships[key]
  }

  // Count discovered relationships
  const totalRelationships = 10 // 5 suspects, each has 4 connections, but pairs = 10
  const discoveredCount = Object.keys(discoveredRelationships).length

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
          Discover connections through interrogation, documents, and searching rooms.
          Strong relationships may indicate conspiracy partners.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${(discoveredCount / totalRelationships) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{discoveredCount}/{totalRelationships} discovered</span>
        </div>
      </div>

      {/* Relationship Grid */}
      <div className="space-y-4">
        {suspects.map(suspect => {
          const suspectRelationships = relationships[suspect]
          return (
            <div key={suspect} className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">{suspect}</h3>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {Object.entries(suspectRelationships).map(([otherSuspect, _relationshipType]) => {
                  const discovered = isDiscovered(suspect, otherSuspect)
                  const discoveredType = discovered ? getDiscoveredType(suspect, otherSuspect) : null
                  const relType = discovered ? relationshipTypes[discoveredType] : null

                  return (
                    <div
                      key={otherSuspect}
                      className="bg-gray-800 rounded p-3 border-2"
                      style={{ borderColor: discovered ? relType.color : '#4B5563' }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{otherSuspect}</span>
                        {discovered ? (
                          <span
                            className="text-xs px-2 py-1 rounded font-bold"
                            style={{
                              backgroundColor: relType.color + '40',
                              color: relType.color
                            }}
                          >
                            {relType.strength}
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded font-bold bg-gray-700 text-gray-400 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            ???
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {discovered ? relType.description : 'Connection unknown - investigate to discover'}
                      </div>
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
