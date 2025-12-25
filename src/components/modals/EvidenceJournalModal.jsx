import { useState, useMemo } from 'react'
import { BookOpen, Filter, Fingerprint, MessageSquare, FileText, MapPin, User, Package, FolderOpen, Mail, StickyNote, Send, Eye } from 'lucide-react'
import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'
import { DOCUMENT_TYPES } from '../../data/documents'
import DocumentModal from './DocumentModal'

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

// Document types config for Documents tab
const DOC_TYPE_ICONS = {
  [DOCUMENT_TYPES.LETTER]: Mail,
  [DOCUMENT_TYPES.FINANCIAL]: FileText,
  [DOCUMENT_TYPES.DIARY]: BookOpen,
  [DOCUMENT_TYPES.NOTE]: StickyNote,
  [DOCUMENT_TYPES.TELEGRAM]: Send
}

const DOC_TYPE_COLORS = {
  [DOCUMENT_TYPES.LETTER]: 'text-amber-400',
  [DOCUMENT_TYPES.FINANCIAL]: 'text-gray-400',
  [DOCUMENT_TYPES.DIARY]: 'text-yellow-400',
  [DOCUMENT_TYPES.NOTE]: 'text-yellow-300',
  [DOCUMENT_TYPES.TELEGRAM]: 'text-blue-400'
}

const DocumentCard = ({ document, onClick }) => {
  const Icon = DOC_TYPE_ICONS[document.type] || FileText
  const colorClass = DOC_TYPE_COLORS[document.type] || 'text-gray-400'

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all touch-active"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${colorClass} mt-0.5`} />
        <div className="flex-1">
          <h4 className="font-bold text-white">{document.title}</h4>
          <p className="text-sm text-gray-400 mt-1">
            Found in: {document.foundIn}
          </p>
          {document.from && document.to && (
            <p className="text-xs text-gray-500 mt-1">
              From {document.from} to {document.to}
            </p>
          )}
          {document.isIncriminating && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-red-900/50 text-red-400 rounded">
              Potentially Incriminating
            </span>
          )}
        </div>
        <Eye className="w-5 h-5 text-gray-500" />
      </div>
    </button>
  )
}

const EvidenceJournalModal = ({ clues, suspects, documents = [], onClose }) => {
  const [activeTab, setActiveTab] = useState('evidence')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState(null)
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

  // If viewing a document, show the DocumentModal
  if (selectedDocument) {
    return (
      <DocumentModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    )
  }

  // Summary footer for mobile
  const summaryFooter = activeTab === 'evidence' && clues.length > 0 && isMobile ? (
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
      title="CASE FILES"
      size="xl"
      borderColor="border-indigo-600"
      stickyFooter={summaryFooter}
    >
      {/* Tab Bar */}
      <div className="flex gap-2 mb-4 border-b border-gray-700 -mx-4 md:-mx-6 px-4 md:px-6">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'evidence'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            Evidence ({clues.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-yellow-500 text-yellow-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            Documents ({documents.length})
          </span>
        </button>
      </div>

      {/* Evidence Tab Content */}
      {activeTab === 'evidence' && (
        <>
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
        </>
      )}

      {/* Documents Tab Content */}
      {activeTab === 'documents' && (
        <>
          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No documents found yet.</p>
              <p className="text-sm mt-2">Search rooms to discover letters, diaries, and other documents.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <DocumentCard
                  key={index}
                  document={doc}
                  onClick={() => setSelectedDocument(doc)}
                />
              ))}
            </div>
          )}

          {documents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
              Tap on a document to read its full contents.
            </div>
          )}
        </>
      )}
    </ResponsiveModal>
  )
}

export default EvidenceJournalModal
