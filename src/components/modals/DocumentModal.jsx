import { FileText, Mail, BookOpen, StickyNote, Send, MapPin } from 'lucide-react'
import { DOCUMENT_TYPES } from '../../data/documents'

const TYPE_CONFIG = {
  [DOCUMENT_TYPES.LETTER]: {
    icon: Mail,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-300',
    paperStyle: 'font-serif'
  },
  [DOCUMENT_TYPES.FINANCIAL]: {
    icon: FileText,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-400',
    paperStyle: 'font-mono text-sm'
  },
  [DOCUMENT_TYPES.DIARY]: {
    icon: BookOpen,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-300',
    paperStyle: 'font-serif italic'
  },
  [DOCUMENT_TYPES.NOTE]: {
    icon: StickyNote,
    bgColor: 'bg-yellow-100',
    textColor: 'text-gray-800',
    borderColor: 'border-yellow-400',
    paperStyle: 'font-handwriting'
  },
  [DOCUMENT_TYPES.TELEGRAM]: {
    icon: Send,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-300',
    paperStyle: 'font-mono uppercase tracking-wide'
  }
}

const DocumentModal = ({ document, onClose, onAddToEvidence }) => {
  if (!document) return null

  const config = TYPE_CONFIG[document.type] || TYPE_CONFIG[DOCUMENT_TYPES.NOTE]
  const Icon = config.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-4 border-yellow-600 rounded-lg p-6 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold text-yellow-400">{document.title}</h2>
              {document.foundIn && (
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Found in: {document.foundIn}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-bold"
          >
            Close
          </button>
        </div>

        {/* Document Content - styled like old paper */}
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-6 shadow-lg relative overflow-hidden`}>
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
            }}
          />

          {/* Content */}
          <pre className={`${config.textColor} ${config.paperStyle} whitespace-pre-wrap leading-relaxed relative z-10`}>
            {document.content}
          </pre>

          {/* Aged corners effect */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-amber-200/30 to-transparent" />
          <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-200/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-amber-200/30 to-transparent" />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-amber-200/30 to-transparent" />
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-500 italic">
            This document may contain vital evidence...
          </p>
          {onAddToEvidence && (
            <button
              onClick={() => onAddToEvidence(document)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold text-sm"
            >
              Add to Evidence Journal
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentModal
