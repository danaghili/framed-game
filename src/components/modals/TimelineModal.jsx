import { useState } from 'react'
import { Clock, AlertTriangle, Check, HelpCircle, Lock, UserCheck } from 'lucide-react'
import { ALIBI_STRENGTH_CONFIG, MURDER_TIME, TIME_SLOTS } from '../../data/timeline'
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

const UnknownTimeSlot = ({ slot }) => {
  return (
    <div
      className={`p-3 rounded border ${
        slot.isCritical
          ? 'border-red-500/50 bg-red-900/10'
          : 'border-gray-700 bg-gray-800/50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-gray-400">{slot.label}</span>
          {slot.isCritical && (
            <span className="text-xs text-red-400/70 font-bold">(MURDER TIME)</span>
          )}
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-700 text-gray-400">
          ???
        </span>
      </div>

      <div className="flex items-start gap-2">
        <Lock className="w-4 h-4 mt-0.5 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500 italic">Whereabouts unknown</p>
          <p className="text-xs text-gray-600 mt-1">
            Interrogate suspect to reveal their alibi
          </p>
        </div>
      </div>
    </div>
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

const ProgressDots = ({ discovered, total }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < discovered ? 'bg-purple-500' : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  )
}

const SuspectSummary = ({ suspect, timeline: _timeline, discoveredSlots, isSelected, onClick }) => {
  const discoveredCount = discoveredSlots.length
  const totalSlots = 5
  const isFullyInterrogated = discoveredCount === totalSlots

  // Build summary from discovered slots only
  const summary = discoveredCount > 0
    ? {
        confirmed: discoveredSlots.filter(s => s.strength === 'CONFIRMED').length,
        partial: discoveredSlots.filter(s => s.strength === 'PARTIAL').length,
        weak: discoveredSlots.filter(s => s.strength === 'WEAK').length,
        none: discoveredSlots.filter(s => s.strength === 'NONE').length,
        hasCriticalGap: discoveredSlots.some(s => s.isCritical && s.strength === 'NONE')
      }
    : null

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg text-left w-full ${
        isSelected
          ? 'bg-purple-600 border-2 border-purple-400'
          : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-white text-sm">{suspect}</span>
        {isFullyInterrogated && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            Full
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <ProgressDots discovered={discoveredCount} total={totalSlots} />
        <span className="text-xs text-gray-400">{discoveredCount}/{totalSlots}</span>
      </div>

      {summary ? (
        <>
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
        </>
      ) : (
        <div className="text-xs text-gray-500 italic">
          Not yet interrogated
        </div>
      )}
    </button>
  )
}

const TimelineModal = ({ timelines, suspects, discoveredTimeline = {}, onClose }) => {
  const [selectedSuspect, setSelectedSuspect] = useState(suspects[0])
  const timeline = timelines[selectedSuspect]
  const isMobile = useIsMobile()

  // Get discovered slots for selected suspect
  const suspectDiscovered = discoveredTimeline[selectedSuspect] || {}
  const discoveredSlotIds = Object.keys(suspectDiscovered)

  // Build array of discovered slot data for this suspect
  const getDiscoveredSlots = (suspect) => {
    const discovered = discoveredTimeline[suspect] || {}
    return Object.values(discovered)
  }

  // Count total discovered across all suspects
  const totalDiscovered = Object.values(discoveredTimeline).reduce(
    (sum, suspectSlots) => sum + Object.keys(suspectSlots).length,
    0
  )
  const totalPossible = suspects.length * 5

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
      <div className="mb-4 bg-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          Murder occurred at {MURDER_TIME}. Interrogate suspects to reveal their alibis.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${(totalDiscovered / totalPossible) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{totalDiscovered}/{totalPossible} slots</span>
        </div>
      </div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* Suspect List - Horizontal scroll on mobile */}
        <div className={isMobile ? 'order-first' : ''}>
          <h3 className="text-sm font-bold text-gray-400 mb-2">SUSPECTS</h3>
          <div className={`${isMobile ? 'flex gap-2 overflow-x-auto hide-scrollbar pb-2' : 'space-y-2'}`}>
            {suspects.map(suspect => (
              <div key={suspect} className={isMobile ? 'flex-shrink-0 w-40' : ''}>
                <SuspectSummary
                  suspect={suspect}
                  timeline={timelines[suspect]}
                  discoveredSlots={getDiscoveredSlots(suspect)}
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
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">
                {selectedSuspect}&apos;s Timeline
              </h3>
              {discoveredSlotIds.length === 5 && (
                <span className="text-xs px-2 py-1 rounded bg-purple-500/30 text-purple-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Fully Interrogated
                </span>
              )}
            </div>
            {discoveredSlotIds.length > 0 && (
              <span className="text-sm text-gray-400">
                Usually found in: {timeline.location}
              </span>
            )}
          </div>

          {discoveredSlotIds.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 rounded-lg">
              <Lock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 italic mb-2">Timeline not yet discovered.</p>
              <p className="text-xs text-gray-500">
                Interrogate {selectedSuspect.split(' ').pop()} to reveal their whereabouts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {TIME_SLOTS.map(timeSlot => {
                const discoveredSlot = suspectDiscovered[timeSlot.id]
                if (discoveredSlot) {
                  return <TimeSlotRow key={timeSlot.id} slot={discoveredSlot} />
                } else {
                  return <UnknownTimeSlot key={timeSlot.id} slot={timeSlot} />
                }
              })}
            </div>
          )}

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
            <p className="text-xs text-gray-500 mt-3">
              Tip: Documents and witness statements may reveal partial timeline information.
            </p>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  )
}

export default TimelineModal
