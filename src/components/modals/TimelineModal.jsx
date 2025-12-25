import { useState } from 'react'
import { Clock, AlertTriangle, Check, HelpCircle } from 'lucide-react'
import { ALIBI_STRENGTH_CONFIG, MURDER_TIME } from '../../data/timeline'
import { getAlibiSummary } from '../../utils/timelineGenerator'
import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'

const AlibiStrengthBadge = ({ strength }) => {
  const config = ALIBI_STRENGTH_CONFIG[strength]

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

const TimeSlotRow = ({ slot }) => {
  const config = ALIBI_STRENGTH_CONFIG[slot.strength]
  const Icon = slot.strength === 'CONFIRMED' ? Check
    : slot.strength === 'NONE' ? AlertTriangle
    : HelpCircle

  return (
    <div
      className={`p-3 rounded border ${
        slot.isCritical
          ? 'border-red-500 bg-red-900/20'
          : 'border-gray-600 bg-gray-800'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-bold text-white">{slot.timeLabel}</span>
          {slot.isCritical && (
            <span className="text-xs text-red-400 font-bold">(MURDER TIME)</span>
          )}
        </div>
        <AlibiStrengthBadge strength={slot.strength} />
      </div>

      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 mt-0.5" style={{ color: config.color }} />
        <div>
          <p className="text-sm text-gray-300">{slot.activity}</p>
          {slot.witness !== 'no one' && (
            <p className="text-xs text-gray-500 mt-1">
              Witnessed by: {slot.witness}
            </p>
          )}
          {slot.tell && (
            <p className="text-xs text-yellow-400 mt-1 italic">
              * {slot.tell}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const SuspectSummary = ({ timeline, isSelected, onClick }) => {
  const summary = getAlibiSummary(timeline)

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg text-left w-full ${
        isSelected
          ? 'bg-blue-600 border-2 border-blue-400'
          : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
      }`}
    >
      <div className="font-bold text-white text-sm mb-1">{timeline.suspect}</div>
      <div className="flex gap-1 flex-wrap">
        {summary.confirmed > 0 && (
          <span className="text-xs px-1 rounded" style={{ backgroundColor: '#22c55e20', color: '#22c55e' }}>
            {summary.confirmed} confirmed
          </span>
        )}
        {summary.partial > 0 && (
          <span className="text-xs px-1 rounded" style={{ backgroundColor: '#eab30820', color: '#eab308' }}>
            {summary.partial} partial
          </span>
        )}
        {summary.weak > 0 && (
          <span className="text-xs px-1 rounded" style={{ backgroundColor: '#f9731620', color: '#f97316' }}>
            {summary.weak} weak
          </span>
        )}
        {summary.none > 0 && (
          <span className="text-xs px-1 rounded" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
            {summary.none} gaps
          </span>
        )}
      </div>
      {summary.hasCriticalGap && (
        <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
          <AlertTriangle className="w-3 h-3" />
          No alibi at murder time
        </div>
      )}
    </button>
  )
}

const TimelineModal = ({ timelines, suspects, onClose }) => {
  const [selectedSuspect, setSelectedSuspect] = useState(suspects[0])
  const timeline = timelines[selectedSuspect]
  const isMobile = useIsMobile()

  if (!timeline) {
    return null
  }

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="TIMELINE ANALYSIS"
      size="full"
      borderColor="border-purple-600"
    >
      <p className="text-sm text-gray-400 mb-4">
        Murder occurred at {MURDER_TIME}. Verify each suspect&apos;s whereabouts.
      </p>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* Suspect List - Horizontal scroll on mobile */}
        <div className={isMobile ? 'order-first' : ''}>
          <h3 className="text-sm font-bold text-gray-400 mb-2">SUSPECTS</h3>
          <div className={`${isMobile ? 'flex gap-2 overflow-x-auto hide-scrollbar pb-2' : 'space-y-2'}`}>
            {suspects.map(suspect => (
              <div key={suspect} className={isMobile ? 'flex-shrink-0 w-40' : ''}>
                <SuspectSummary
                  timeline={timelines[suspect]}
                  isSelected={selectedSuspect === suspect}
                  onClick={() => setSelectedSuspect(suspect)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Detail */}
        <div className={isMobile ? '' : 'col-span-3'}>
          <div className={`flex ${isMobile ? 'flex-col gap-1' : 'items-center justify-between'} mb-4`}>
            <h3 className="text-xl font-bold text-white">
              {selectedSuspect}&apos;s Timeline
            </h3>
            <span className="text-sm text-gray-400">
              Usually found in: {timeline.location}
            </span>
          </div>

          <div className="space-y-3">
            {timeline.slots.map(slot => (
              <TimeSlotRow key={slot.slotId} slot={slot} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <h4 className="text-sm font-bold text-gray-400 mb-2">ALIBI STRENGTH GUIDE</h4>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {Object.entries(ALIBI_STRENGTH_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs text-gray-300">
                    <strong>{config.label}:</strong> {config.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default TimelineModal
