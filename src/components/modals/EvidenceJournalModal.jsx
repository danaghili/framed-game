import { useState, useMemo } from 'react'
import { BookOpen, Filter, Fingerprint, MessageSquare, FileText, MapPin, User, Package } from 'lucide-react'
import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'

// Evidence categories with their styling
const EVIDENCE_CATEGORIES = {
  physical: {
    label: 'Physical',
    icon: Fingerprint,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/30',
    borderColor: 'border-cyan-500'
  },
  testimony: {
    label: 'Testimony',
    icon: MessageSquare,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/30',
    borderColor: 'border-amber-500'
  },
  document: {
    label: 'Document',
    icon: FileText,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/30',
    borderColor: 'border-purple-500'
  },
  location: {
    label: 'Location',
    icon: MapPin,
    color: 'text-green-400',
    bgColor: 'bg-green-900/30',
    borderColor: 'border-green-500'
  },
  suspect: {
    label: 'Suspect',
    icon: User,
    color: 'text-red-400',
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-500'
  },
  item: {
    label: 'Item',
    icon: Package,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-500'
  },
  other: {
    label: 'Other',
    icon: BookOpen,
    color: 'text-gray-400',
    bgColor: 'bg-gray-900/30',
    borderColor: 'border-gray-500'
  }
}

/**
 * Categorizes evidence based on its content.
 */
function categorizeEvidence(clue) {
  const lowerClue = clue.toLowerCase()

  // Physical evidence
  if (lowerClue.includes('footprint') || lowerClue.includes('hair') ||
      lowerClue.includes('fingerprint') || lowerClue.includes('blood') ||
      lowerClue.includes('build') || lowerClue.includes('height') ||
      lowerClue.includes('shoe size') || lowerClue.includes('handed')) {
    return 'physical'
  }

  // Testimony/interrogation
  if (lowerClue.includes('alibi') || lowerClue.includes('interrogated') ||
      lowerClue.includes('claims') || lowerClue.includes('says') ||
      lowerClue.includes('story') || lowerClue.includes('motive')) {
    return 'testimony'
  }

  // Documents
  if (lowerClue.includes('document') || lowerClue.includes('letter') ||
      lowerClue.includes('records') || lowerClue.includes('correspondence') ||
      lowerClue.includes('financial') || lowerClue.includes('wrote')) {
    return 'document'
  }

  // Location/crime scene
  if (lowerClue.includes('body') || lowerClue.includes('crime scene') ||
      lowerClue.includes('room') || lowerClue.includes('found here') ||
      lowerClue.includes('searched')) {
    return 'location'
  }

  // Suspect sightings
  if (lowerClue.includes('saw') || lowerClue.includes('spotted') ||
      lowerClue.includes('witness') || lowerClue.includes('seen')) {
    return 'suspect'
  }

  // Items
  if (lowerClue.includes('forensics kit') || lowerClue.includes('master key') ||
      lowerClue.includes('weapon') || lowerClue.includes('examined')) {
    return 'item'
  }

  return 'other'
}

/**
 * Extracts key entities mentioned in the clue.
 */
function extractEntities(clue, suspects) {
  const entities = []

  // Check for suspect names
  suspects.forEach(suspect => {
    if (clue.includes(suspect)) {
      entities.push({ type: 'suspect', name: suspect })
    }
  })

  return entities
}

const FilterButton = ({ config, isActive, onClick, count }) => {
  const Icon = config.icon

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        isActive
          ? `${config.bgColor} ${config.color} ${config.borderColor} border-2`
          : 'bg-gray-700 text-gray-400 border-2 border-transparent hover:bg-gray-600'
      }`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
      <span className={`ml-1 px-1.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-600'}`}>
        {count}
      </span>
    </button>
  )
}

const EvidenceCard = ({ clue, category, index, suspects }) => {
  const config = EVIDENCE_CATEGORIES[category]
  const Icon = config.icon
  const entities = extractEntities(clue, suspects)

  return (
    <div className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-r-lg p-3`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
        <div className="flex-1">
          <p className="text-sm text-gray-200">{clue}</p>
          {entities.length > 0 && (
            <div className="flex gap-1 mt-2">
              {entities.map((entity, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300"
                >
                  {entity.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">#{index + 1}</span>
      </div>
    </div>
  )
}

const EvidenceJournalModal = ({ clues, suspects, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const isMobile = useIsMobile()

  // Categorize all clues
  const categorizedClues = useMemo(() => {
    return clues.map((clue, index) => ({
      clue,
      category: categorizeEvidence(clue),
      index
    }))
  }, [clues])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts = { all: clues.length }
    Object.keys(EVIDENCE_CATEGORIES).forEach(cat => {
      counts[cat] = categorizedClues.filter(c => c.category === cat).length
    })
    return counts
  }, [categorizedClues, clues.length])

  // Filter clues
  const filteredClues = useMemo(() => {
    if (activeFilter === 'all') return categorizedClues
    return categorizedClues.filter(c => c.category === activeFilter)
  }, [categorizedClues, activeFilter])

  // Summary footer for mobile
  const summaryFooter = clues.length > 0 && isMobile ? (
    <div className="flex gap-3 flex-wrap text-xs text-gray-400">
      {Object.entries(EVIDENCE_CATEGORIES).map(([key, config]) => {
        const count = categoryCounts[key]
        if (count === 0) return null
        const Icon = config.icon
        return (
          <div key={key} className="flex items-center gap-1">
            <Icon className={`w-3 h-3 ${config.color}`} />
            <span>{count}</span>
          </div>
        )
      })}
    </div>
  ) : null

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="EVIDENCE JOURNAL"
      size="xl"
      borderColor="border-indigo-600"
      stickyFooter={summaryFooter}
    >
      <p className="text-sm text-gray-400 mb-4">
        {clues.length} piece{clues.length !== 1 ? 's' : ''} of evidence collected
      </p>

      {/* Filter Bar - Scrollable on mobile */}
      <div className={`flex items-center gap-2 mb-4 ${isMobile ? 'overflow-x-auto hide-scrollbar pb-2' : 'flex-wrap'}`}>
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap touch-active ${
            activeFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          All ({categoryCounts.all})
        </button>
        {Object.entries(EVIDENCE_CATEGORIES).map(([key, config]) => (
          categoryCounts[key] > 0 && (
            <FilterButton
              key={key}
              config={config}
              isActive={activeFilter === key}
              onClick={() => setActiveFilter(key)}
              count={categoryCounts[key]}
            />
          )
        ))}
      </div>

      {/* Evidence List */}
      <div className="space-y-2">
        {filteredClues.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {clues.length === 0
              ? 'No evidence collected yet. Search rooms and interrogate suspects!'
              : 'No evidence matches this filter.'}
          </div>
        ) : (
          [...filteredClues].reverse().map((item) => (
            <EvidenceCard
              key={item.index}
              clue={item.clue}
              category={item.category}
              index={item.index}
              suspects={suspects}
            />
          ))
        )}
      </div>

      {/* Summary - Desktop only */}
      {clues.length > 0 && !isMobile && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex gap-4 text-xs text-gray-400">
            {Object.entries(EVIDENCE_CATEGORIES).map(([key, config]) => {
              const count = categoryCounts[key]
              if (count === 0) return null
              const Icon = config.icon
              return (
                <div key={key} className="flex items-center gap-1">
                  <Icon className={`w-3 h-3 ${config.color}`} />
                  <span>{count} {config.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </ResponsiveModal>
  )
}

export default EvidenceJournalModal
