import { useState } from 'react'
import { BookOpen, FolderOpen, Fingerprint, MessageSquare, FileText, MapPin, User, Package, Eye, Mail, StickyNote, Send } from 'lucide-react'
import { DOCUMENT_TYPES } from '../data/documents'
import DocumentModal from './modals/DocumentModal'

const EVIDENCE_CATEGORIES = {
  physical: { icon: Fingerprint, color: 'text-cyan-400' },
  testimony: { icon: MessageSquare, color: 'text-amber-400' },
  document: { icon: FileText, color: 'text-purple-400' },
  location: { icon: MapPin, color: 'text-green-400' },
  suspect: { icon: User, color: 'text-red-400' },
  item: { icon: Package, color: 'text-blue-400' },
  other: { icon: BookOpen, color: 'text-gray-400' }
}

const DOC_ICONS = {
  [DOCUMENT_TYPES.LETTER]: Mail,
  [DOCUMENT_TYPES.FINANCIAL]: FileText,
  [DOCUMENT_TYPES.DIARY]: BookOpen,
  [DOCUMENT_TYPES.NOTE]: StickyNote,
  [DOCUMENT_TYPES.TELEGRAM]: Send
}

function categorizeEvidence(clue) {
  const lower = clue.toLowerCase()
  if (lower.match(/footprint|hair|fingerprint|blood|build|height|shoe size|handed/)) return 'physical'
  if (lower.match(/alibi|interrogated|claims|says|story|motive/)) return 'testimony'
  if (lower.match(/document|letter|records|correspondence|financial|wrote/)) return 'document'
  if (lower.match(/body|crime scene|room|found here|searched/)) return 'location'
  if (lower.match(/saw|spotted|witness|seen/)) return 'suspect'
  if (lower.match(/forensics kit|master key|weapon|examined/)) return 'item'
  return 'other'
}

const InlineEvidencePanel = ({ clues = [], documents = [] }) => {
  const [activeTab, setActiveTab] = useState('evidence')
  const [selectedDocument, setSelectedDocument] = useState(null)

  if (selectedDocument) {
    return (
      <DocumentModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    )
  }

  return (
    <div className="bg-gray-800 border-2 border-indigo-600 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header with tabs */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold border-b-2 ${
              activeTab === 'evidence'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Fingerprint className="w-3 h-3" />
            Evidence ({clues.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold border-b-2 ${
              activeTab === 'documents'
                ? 'border-yellow-500 text-yellow-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <FolderOpen className="w-3 h-3" />
            Docs ({documents.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        {activeTab === 'evidence' && (
          <>
            {clues.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No evidence collected yet
              </div>
            ) : (
              <div className="space-y-2">
                {[...clues].reverse().map((clue, idx) => {
                  const category = categorizeEvidence(clue)
                  const config = EVIDENCE_CATEGORIES[category]
                  const Icon = config.icon
                  return (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-gray-900 rounded text-xs">
                      <Icon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${config.color}`} />
                      <span className="text-gray-300">{clue}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'documents' && (
          <>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No documents found yet
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc, idx) => {
                  const Icon = DOC_ICONS[doc.type] || FileText
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDocument(doc)}
                      className="w-full flex items-center gap-2 p-2 bg-gray-900 hover:bg-gray-700 rounded text-left transition-colors"
                    >
                      <Icon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{doc.title}</div>
                        <div className="text-[10px] text-gray-500">{doc.foundIn}</div>
                      </div>
                      <Eye className="w-3 h-3 text-gray-500" />
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default InlineEvidencePanel
