import { useState } from 'react'
import { FileText, Mail, BookOpen, StickyNote, Send, FolderOpen, Eye } from 'lucide-react'
import { DOCUMENT_TYPES } from '../../data/documents'
import DocumentModal from './DocumentModal'
import ResponsiveModal from '../responsive/ResponsiveModal'

const TYPE_ICONS = {
  [DOCUMENT_TYPES.LETTER]: Mail,
  [DOCUMENT_TYPES.FINANCIAL]: FileText,
  [DOCUMENT_TYPES.DIARY]: BookOpen,
  [DOCUMENT_TYPES.NOTE]: StickyNote,
  [DOCUMENT_TYPES.TELEGRAM]: Send
}

const TYPE_COLORS = {
  [DOCUMENT_TYPES.LETTER]: 'text-amber-400',
  [DOCUMENT_TYPES.FINANCIAL]: 'text-gray-400',
  [DOCUMENT_TYPES.DIARY]: 'text-yellow-400',
  [DOCUMENT_TYPES.NOTE]: 'text-yellow-300',
  [DOCUMENT_TYPES.TELEGRAM]: 'text-blue-400'
}

const DocumentCard = ({ document, onClick }) => {
  const Icon = TYPE_ICONS[document.type] || FileText
  const colorClass = TYPE_COLORS[document.type] || 'text-gray-400'

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-gray-600 hover:border-yellow-500 transition-all"
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

const DocumentsListModal = ({ documents, onClose }) => {
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
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="FOUND DOCUMENTS"
      size="lg"
      borderColor="border-yellow-600"
    >
      <p className="text-sm text-gray-400 mb-4">
        {documents.length} document{documents.length !== 1 ? 's' : ''} discovered
      </p>

      {documents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
    </ResponsiveModal>
  )
}

export default DocumentsListModal
