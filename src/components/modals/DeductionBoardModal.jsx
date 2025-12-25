import { ClipboardList, Check, X, HelpCircle, Target, RotateCcw } from 'lucide-react'
import { DEDUCTION_STATE } from '../../hooks/useDeductionBoard'
import ResponsiveModal from '../responsive/ResponsiveModal'
import { useIsMobile } from '../../hooks/useIsMobile'

const STATE_CONFIG = {
  [DEDUCTION_STATE.UNKNOWN]: {
    label: '?',
    color: 'bg-gray-600',
    textColor: 'text-gray-400',
    icon: HelpCircle
  },
  [DEDUCTION_STATE.POSSIBLE]: {
    label: 'Maybe',
    color: 'bg-yellow-600',
    textColor: 'text-yellow-400',
    icon: HelpCircle
  },
  [DEDUCTION_STATE.RULED_OUT]: {
    label: 'No',
    color: 'bg-red-600',
    textColor: 'text-red-400',
    icon: X
  },
  [DEDUCTION_STATE.SUSPECTED]: {
    label: 'YES',
    color: 'bg-green-600',
    textColor: 'text-green-400',
    icon: Check
  }
}

const DeductionItem = ({ name, itemState, onCycleState }) => {
  const config = STATE_CONFIG[itemState.state]
  const Icon = config.icon

  // Cycle through states on click
  const handleClick = () => {
    const states = Object.values(DEDUCTION_STATE)
    const currentIndex = states.indexOf(itemState.state)
    const nextIndex = (currentIndex + 1) % states.length
    onCycleState(states[nextIndex])
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all hover:opacity-80 ${
        itemState.state === DEDUCTION_STATE.RULED_OUT ? 'opacity-50' : ''
      }`}
    >
      <span className={`text-sm ${
        itemState.state === DEDUCTION_STATE.RULED_OUT
          ? 'line-through text-gray-500'
          : itemState.state === DEDUCTION_STATE.SUSPECTED
          ? 'text-green-300 font-bold'
          : 'text-white'
      }`}>
        {name}
      </span>
      <span className={`${config.color} px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    </div>
  )
}

const DeductionSection = ({ title, items, itemStates, onSetState, color }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-2 ${color}`}>
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {items.map(item => (
          <DeductionItem
            key={item}
            name={item}
            itemState={itemStates[item]}
            onCycleState={(newState) => onSetState(item, newState)}
          />
        ))}
      </div>
    </div>
  )
}

const SummaryPanel = ({ summary }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border-2 border-yellow-500">
      <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
        <Target className="w-5 h-5" />
        YOUR THEORY
      </h3>

      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 uppercase mb-1">Killer(s)</div>
          {summary.suspectedSuspects.length > 0 ? (
            <div className="text-green-400 font-bold">
              {summary.suspectedSuspects.join(' & ')}
            </div>
          ) : (
            <div className="text-gray-500 italic">Not yet determined</div>
          )}
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase mb-1">Weapon</div>
          {summary.suspectedWeapons.length === 1 ? (
            <div className="text-green-400 font-bold">{summary.suspectedWeapons[0]}</div>
          ) : summary.suspectedWeapons.length > 1 ? (
            <div className="text-yellow-400">Multiple possibilities</div>
          ) : (
            <div className="text-gray-500 italic">Not yet determined</div>
          )}
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase mb-1">Location</div>
          {summary.suspectedRooms.length === 1 ? (
            <div className="text-green-400 font-bold">{summary.suspectedRooms[0]}</div>
          ) : summary.suspectedRooms.length > 1 ? (
            <div className="text-yellow-400">Multiple possibilities</div>
          ) : (
            <div className="text-gray-500 italic">Not yet determined</div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2">ELIMINATED</div>
          <div className="text-xs text-red-400">
            {summary.ruledOutSuspects.length} suspects, {summary.ruledOutWeapons.length} weapons, {summary.ruledOutRooms.length} rooms
          </div>
        </div>

        {summary.readyToAccuse && (
          <div className="mt-4 p-2 bg-green-900 border border-green-500 rounded text-center">
            <div className="text-green-400 font-bold text-sm">Ready to make accusation!</div>
          </div>
        )}
      </div>
    </div>
  )
}

const DeductionBoardModal = ({
  suspects,
  weapons,
  rooms,
  deductionState,
  deductionActions,
  summary,
  onClose
}) => {
  const isMobile = useIsMobile()

  const resetButton = (
    <button
      onClick={deductionActions.clearAll}
      className="bg-gray-600 hover:bg-gray-700 px-4 py-3 md:py-2 rounded-lg font-bold flex items-center justify-center gap-2 w-full touch-active"
    >
      <RotateCcw className="w-4 h-4" />
      Reset All
    </button>
  )

  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="DEDUCTION BOARD"
      size="full"
      borderColor="border-teal-600"
      stickyFooter={isMobile ? resetButton : null}
    >
      <p className="text-sm text-gray-400 mb-4">
        Tap items to cycle through: Unknown → Maybe → Ruled Out → Suspected
      </p>

      {/* Grid - Responsive */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* Summary first on mobile for context */}
        {isMobile && <SummaryPanel summary={summary} />}

        {/* Suspects */}
        <DeductionSection
          title="SUSPECTS"
          items={suspects}
          itemStates={deductionState.suspects}
          onSetState={deductionActions.setSuspectState}
          color="border-blue-500"
        />

        {/* Weapons */}
        <DeductionSection
          title="WEAPONS"
          items={weapons}
          itemStates={deductionState.weapons}
          onSetState={deductionActions.setWeaponState}
          color="border-red-500"
        />

        {/* Rooms */}
        <DeductionSection
          title="ROOMS"
          items={rooms}
          itemStates={deductionState.rooms}
          onSetState={deductionActions.setRoomState}
          color="border-purple-500"
        />

        {/* Summary on desktop */}
        {!isMobile && <SummaryPanel summary={summary} />}
      </div>

      {/* Legend - Compact on mobile */}
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <h4 className="text-sm font-bold text-gray-400 mb-2">LEGEND</h4>
        <div className={`flex ${isMobile ? 'flex-wrap gap-3' : 'gap-6'}`}>
          {Object.entries(STATE_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            return (
              <div key={key} className="flex items-center gap-2">
                <span className={`${config.color} px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </span>
                {!isMobile && (
                  <span className="text-xs text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop reset button */}
      {!isMobile && (
        <div className="mt-4 flex justify-end">
          {resetButton}
        </div>
      )}
    </ResponsiveModal>
  )
}

export default DeductionBoardModal
