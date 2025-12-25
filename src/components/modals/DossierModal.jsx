import { useState } from 'react'
import { Banknote, Check, X, Minus, User } from 'lucide-react'
import { MOTIVE_STRENGTH_CONFIG } from '../../data/constants'
import { TRAIT_CATEGORIES } from '../../data/physicalTraits'

const MotiveIndicator = ({ strength }) => {
  const config = MOTIVE_STRENGTH_CONFIG[strength]

  return (
    <div className="flex items-center gap-2">
      {/* Strength bars */}
      <div className="flex gap-0.5">
        {[1, 2, 3].map(bar => (
          <div
            key={bar}
            className={`w-2 h-4 rounded-sm ${
              bar <= config.bars ? 'opacity-100' : 'opacity-20'
            }`}
            style={{ backgroundColor: config.color }}
          />
        ))}
      </div>

      {/* Text label */}
      <span
        className="text-xs font-bold px-2 py-0.5 rounded"
        style={{
          backgroundColor: config.color + '20',
          color: config.color
        }}
      >
        {config.label}
      </span>
    </div>
  )
}

const MotiveSection = ({ profile }) => {
  return (
    <div className="border-t border-gray-600 pt-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-red-400">MOTIVE</h4>
        <MotiveIndicator strength={profile.motiveStrength} />
      </div>

      <p className="text-sm text-gray-300 mb-3">
        {profile.motiveDetails}
      </p>

      <div className="flex items-center gap-2 text-sm">
        <Banknote className="w-4 h-4 text-yellow-500" />
        <span className="text-yellow-400 font-bold">
          £{profile.financialStake.toLocaleString()}
        </span>
        <span className="text-gray-500">at stake</span>
      </div>
    </div>
  )
}

const TraitRow = ({ category, suspectValue, discoveredValue }) => {
  const config = TRAIT_CATEGORIES[category]
  const formatValue = (val) => category === 'shoeSize' ? `Size ${val}` : val

  // Determine match status
  let status = 'unknown'
  let StatusIcon = Minus
  let statusColor = 'text-gray-500'

  if (discoveredValue !== undefined) {
    if (suspectValue === discoveredValue) {
      status = 'match'
      StatusIcon = Check
      statusColor = 'text-green-500'
    } else {
      status = 'conflict'
      StatusIcon = X
      statusColor = 'text-red-500'
    }
  }

  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-600 last:border-0">
      <span className="text-sm text-gray-400">{config.label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm capitalize ${status === 'match' ? 'text-green-400' : status === 'conflict' ? 'text-red-400' : 'text-gray-300'}`}>
          {formatValue(suspectValue)}
        </span>
        <StatusIcon className={`w-4 h-4 ${statusColor}`} />
      </div>
    </div>
  )
}

const PhysicalTraitsSection = ({ profile, discoveredTraits }) => {
  const traits = profile.physicalTraits
  if (!traits) return null

  const traitCategories = ['height', 'build', 'hairColor', 'shoeSize', 'handedness']

  // Count matches and conflicts
  const matchCount = traitCategories.filter(cat =>
    discoveredTraits[cat] !== undefined && traits[cat] === discoveredTraits[cat]
  ).length
  const conflictCount = traitCategories.filter(cat =>
    discoveredTraits[cat] !== undefined && traits[cat] !== discoveredTraits[cat]
  ).length

  return (
    <div className="border-t border-gray-600 pt-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <User className="w-4 h-4" />
          PHYSICAL PROFILE
        </h4>
        {(matchCount > 0 || conflictCount > 0) && (
          <div className="flex gap-2 text-xs">
            {matchCount > 0 && (
              <span className="text-green-400">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
            )}
            {conflictCount > 0 && (
              <span className="text-red-400">{conflictCount} conflict{conflictCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded p-3">
        {traitCategories.map(category => (
          <TraitRow
            key={category}
            category={category}
            suspectValue={traits[category]}
            discoveredValue={discoveredTraits[category]}
          />
        ))}
      </div>

      {Object.keys(discoveredTraits).length === 0 && (
        <p className="text-xs text-gray-500 mt-2 italic">
          Find physical evidence to compare against suspect profiles.
        </p>
      )}
    </div>
  )
}

const DossierModal = ({ suspects, suspectProfiles, discoveredTraits = {}, onClose, onShowRelationships }) => {
  const [selectedSuspect, setSelectedSuspect] = useState(suspects[0])
  const profile = suspectProfiles[selectedSuspect]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-4 border-blue-600 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-400">SUSPECT DOSSIERS</h2>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-bold"
          >
            Close
          </button>
        </div>

        {/* Suspect Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {suspects.map(suspect => (
            <button
              key={suspect}
              onClick={() => setSelectedSuspect(suspect)}
              className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${
                selectedSuspect === suspect
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {suspect}
            </button>
          ))}
        </div>

        {/* Detailed Profile */}
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedSuspect}</h3>
              <p className="text-gray-400 text-sm">{profile.occupation} - Age {profile.age}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Current Location</div>
              <div className="text-lg font-bold text-yellow-400">{profile.location}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-bold text-blue-400 mb-1">BACKGROUND</div>
              <div className="text-sm text-gray-300">{profile.background}</div>
            </div>
            <div>
              <div className="text-sm font-bold text-purple-400 mb-1">PERSONALITY</div>
              <div className="text-sm text-gray-300">{profile.personality}</div>
            </div>
          </div>

          {/* Motive Section */}
          <MotiveSection profile={profile} />

          {/* Physical Traits Section */}
          <PhysicalTraitsSection profile={profile} discoveredTraits={discoveredTraits} />

          <div>
            <div className="text-sm font-bold text-green-400 mb-2">KNOWN RELATIONSHIPS</div>
            <div className="text-sm text-gray-400 italic mb-2">
              Understanding connections between suspects is key to uncovering conspiracies...
            </div>
            <button
              onClick={onShowRelationships}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-bold"
            >
              View Full Relationship Network
            </button>
          </div>

          <div className="mt-4 bg-gray-800 border-2 border-yellow-600 rounded p-3">
            <div className="text-sm text-yellow-400">
              <strong>Interrogate this suspect</strong> to learn about their alibi and hear their side of the story.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DossierModal
