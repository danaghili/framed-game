import { useState } from 'react'
import { Users, Check, X, Minus, MessageSquare } from 'lucide-react'
import { WITNESS_RELIABILITY, WITNESS_CATEGORIES } from '../../data/witnesses'
import { summarizeWitnessTestimony } from '../../utils/witnessGenerator'
import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'

const ReliabilityBadge = ({ reliability }) => {
  const config = WITNESS_RELIABILITY[reliability]

  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={{
        backgroundColor: config.color + '20',
        color: config.color
      }}
    >
      {config.label}
    </span>
  )
}

const StatementCard = ({ statement }) => {
  const Icon = statement.type === 'corroborating' ? Check
    : statement.type === 'contradicting' ? X
    : Minus

  const borderColor = statement.type === 'corroborating' ? 'border-green-500'
    : statement.type === 'contradicting' ? 'border-red-500'
    : 'border-gray-500'

  const iconColor = statement.type === 'corroborating' ? 'text-green-500'
    : statement.type === 'contradicting' ? 'text-red-500'
    : 'text-gray-500'

  return (
    <div className={`p-4 rounded-lg border-2 ${borderColor} bg-gray-800`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-white text-sm">{statement.witness}</span>
          <span className="text-xs text-gray-500">
            ({WITNESS_CATEGORIES[statement.category]?.label || statement.category})
          </span>
        </div>
        <ReliabilityBadge reliability={statement.reliability} />
      </div>

      <div className="flex items-start gap-2">
        <Icon className={`w-4 h-4 mt-0.5 ${iconColor}`} />
        <p className="text-sm text-gray-300 italic">&ldquo;{statement.statement}&rdquo;</p>
      </div>
    </div>
  )
}

const SuspectSummaryCard = ({ suspect, statements, isSelected, onClick }) => {
  const summary = summarizeWitnessTestimony(statements)

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg text-left w-full ${
        isSelected
          ? 'bg-amber-600 border-2 border-amber-400'
          : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
      }`}
    >
      <div className="font-bold text-white text-sm mb-2">{suspect}</div>

      <div className="flex gap-2 flex-wrap mb-1">
        {summary.corroborating > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: '#22c55e20', color: '#22c55e' }}>
            <Check className="w-3 h-3" />
            {summary.corroborating}
          </span>
        )}
        {summary.contradicting > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
            <X className="w-3 h-3" />
            {summary.contradicting}
          </span>
        )}
        {summary.neutral > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: '#6b728020', color: '#9ca3af' }}>
            <Minus className="w-3 h-3" />
            {summary.neutral}
          </span>
        )}
      </div>

      <div className="text-xs text-gray-400">
        {summary.total} statement{summary.total !== 1 ? 's' : ''}
        {summary.highReliability > 0 && ` (${summary.highReliability} reliable)`}
      </div>
    </button>
  )
}

const WitnessModal = ({ witnesses, suspects, onClose }) => {
  const [selectedSuspect, setSelectedSuspect] = useState(suspects[0])
  const statements = witnesses[selectedSuspect] || []
  const isMobile = useIsMobile()

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="WITNESS STATEMENTS"
      size="full"
      borderColor="border-amber-600"
    >
      <p className="text-sm text-gray-400 mb-4">
        Testimony collected from staff and guests about each suspect.
      </p>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* Suspect List - Horizontal on mobile */}
        <div className={isMobile ? 'order-first' : ''}>
          <h3 className="text-sm font-bold text-gray-400 mb-2">SUSPECTS</h3>
          <div className={`${isMobile ? 'flex gap-2 overflow-x-auto hide-scrollbar pb-2' : 'space-y-2'}`}>
            {suspects.map(suspect => (
              <div key={suspect} className={isMobile ? 'flex-shrink-0 w-40' : ''}>
                <SuspectSummaryCard
                  suspect={suspect}
                  statements={witnesses[suspect] || []}
                  isSelected={selectedSuspect === suspect}
                  onClick={() => setSelectedSuspect(suspect)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Statements Detail */}
        <div className={isMobile ? '' : 'col-span-3'}>
          <h3 className="text-lg font-bold text-white mb-4">
            Statements About {selectedSuspect}
          </h3>

          {statements.length === 0 ? (
            <p className="text-gray-400 italic">No witness statements collected yet.</p>
          ) : (
            <div className="space-y-3">
              {statements.map((statement, idx) => (
                <StatementCard key={idx} statement={statement} />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-sm font-bold text-gray-400 mb-2">INTERPRETATION GUIDE</h4>
            <div className={`grid gap-3 text-xs ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Corroborates alibi</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <span className="text-gray-300">Contradicts alibi</span>
              </div>
              <div className="flex items-center gap-2">
                <Minus className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">Neutral/unclear</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Note: Family may be biased. Staff are generally more reliable.
            </p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default WitnessModal
