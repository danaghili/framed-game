import { useState } from 'react'
import { Check, X, HelpCircle, Target, RotateCcw, Users, Crosshair, MapPin, UserSearch, Microscope } from 'lucide-react'
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

const TAB_CONFIG = [
  { id: 'theory', label: 'Theory', icon: Target, color: 'text-yellow-400', borderColor: 'border-yellow-500' },
  { id: 'suspects', label: 'Suspects', icon: Users, color: 'text-blue-400', borderColor: 'border-blue-500' },
  { id: 'weapons', label: 'Weapons', icon: Crosshair, color: 'text-red-400', borderColor: 'border-red-500' },
  { id: 'rooms', label: 'Rooms', icon: MapPin, color: 'text-purple-400', borderColor: 'border-purple-500' }
]

const DeductionItem = ({ name, itemState, onCycleState, isInterrogated, isExamined, actionButton }) => {
  const config = STATE_CONFIG[itemState.state]
  const Icon = config.icon

  const handleClick = () => {
    const states = Object.values(DEDUCTION_STATE)
    const currentIndex = states.indexOf(itemState.state)
    const nextIndex = (currentIndex + 1) % states.length
    onCycleState(states[nextIndex])
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        itemState.state === DEDUCTION_STATE.RULED_OUT ? 'opacity-50 bg-gray-800/50' : 'bg-gray-800'
      }`}
    >
      <div
        onClick={handleClick}
        className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1"
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
        {isInterrogated && (
          <span className="text-xs px-1.5 py-0.5 bg-purple-900/50 text-purple-400 rounded">Q</span>
        )}
        {isExamined && (
          <span className="text-xs px-1.5 py-0.5 bg-cyan-900/50 text-cyan-400 rounded">E</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {actionButton}
        <span
          onClick={handleClick}
          className={`${config.color} px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1 cursor-pointer`}
        >
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </div>
    </div>
  )
}

const DeductionList = ({ items, itemStates, onSetState, interrogated = [], examinedWeapons = [], renderActionButton }) => {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <DeductionItem
          key={item}
          name={item}
          itemState={itemStates[item]}
          onCycleState={(newState) => onSetState(item, newState)}
          isInterrogated={interrogated?.includes(item)}
          isExamined={examinedWeapons?.includes(item)}
          actionButton={renderActionButton ? renderActionButton(item) : null}
        />
      ))}
    </div>
  )
}

const SummaryPanel = ({ summary }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-xs text-gray-500 uppercase mb-2">Killer(s)</div>
        {summary.suspectedSuspects.length > 0 ? (
          <div className="text-green-400 font-bold text-lg">
            {summary.suspectedSuspects.join(' & ')}
          </div>
        ) : (
          <div className="text-gray-500 italic">Not yet determined</div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-xs text-gray-500 uppercase mb-2">Weapon</div>
        {summary.suspectedWeapons.length === 1 ? (
          <div className="text-green-400 font-bold text-lg">{summary.suspectedWeapons[0]}</div>
        ) : summary.suspectedWeapons.length > 1 ? (
          <div className="text-yellow-400">{summary.suspectedWeapons.length} possibilities</div>
        ) : (
          <div className="text-gray-500 italic">Not yet determined</div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-xs text-gray-500 uppercase mb-2">Location</div>
        {summary.suspectedRooms.length === 1 ? (
          <div className="text-green-400 font-bold text-lg">{summary.suspectedRooms[0]}</div>
        ) : summary.suspectedRooms.length > 1 ? (
          <div className="text-yellow-400">{summary.suspectedRooms.length} possibilities</div>
        ) : (
          <div className="text-gray-500 italic">Not yet determined</div>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="text-xs text-gray-500 mb-2">ELIMINATED</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-red-400 font-bold text-lg">{summary.ruledOutSuspects.length}</div>
            <div className="text-xs text-gray-500">Suspects</div>
          </div>
          <div>
            <div className="text-red-400 font-bold text-lg">{summary.ruledOutWeapons.length}</div>
            <div className="text-xs text-gray-500">Weapons</div>
          </div>
          <div>
            <div className="text-red-400 font-bold text-lg">{summary.ruledOutRooms.length}</div>
            <div className="text-xs text-gray-500">Rooms</div>
          </div>
        </div>
      </div>

      {summary.readyToAccuse && (
        <div className="p-4 bg-green-900 border border-green-500 rounded-lg text-center">
          <div className="text-green-400 font-bold">Ready to make accusation!</div>
          <div className="text-xs text-green-300 mt-1">You have identified a suspect, weapon, and room</div>
        </div>
      )}
    </div>
  )
}

const TabButton = ({ tab, isActive, onClick, isMobile }) => {
  const Icon = tab.icon
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${
        isActive
          ? `${tab.borderColor} ${tab.color}`
          : 'border-transparent text-gray-400 hover:text-gray-300'
      }`}
    >
      <Icon className="w-4 h-4" />
      {!isMobile && tab.label}
    </button>
  )
}

const Legend = ({ isMobile }) => (
  <div className="p-3 bg-gray-900 rounded-lg mb-4">
    <div className={`flex ${isMobile ? 'justify-around' : 'justify-center gap-6'}`}>
      {Object.entries(STATE_CONFIG).map(([key, config]) => {
        const Icon = config.icon
        return (
          <div key={key} className="flex items-center gap-1">
            <span className={`${config.color} px-2 py-0.5 rounded text-xs font-bold text-white flex items-center gap-1`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
          </div>
        )
      })}
    </div>
    <p className="text-xs text-gray-500 mt-2 text-center">
      Tap items to cycle through states
    </p>
  </div>
)

const ActionButton = ({ icon: Icon, label, onClick, disabled, badge, color }) => ( // eslint-disable-line no-unused-vars
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold text-sm transition-all touch-active ${
      disabled
        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
        : `${color} hover:opacity-80`
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
    {badge && <span className="text-xs opacity-75">({badge})</span>}
  </button>
)

const DeductionBoardModal = ({
  suspects,
  weapons,
  rooms,
  deductionState,
  deductionActions,
  summary,
  onClose,
  // Action handlers
  onInterrogate,
  onExamine,
  interrogationsLeft = 0,
  interrogated = [],
  hasForensicsKit = false,
  forensicsUsesLeft = 0,
  examinedWeapons = [],
  gameOver = false
}) => {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('theory')

  const canInterrogate = interrogationsLeft > 0 && !gameOver
  const canExamine = hasForensicsKit && forensicsUsesLeft > 0 && !gameOver

  const resetButton = (
    <button
      onClick={deductionActions.clearAll}
      className="bg-gray-600 hover:bg-gray-700 px-4 py-3 md:py-2 rounded-lg font-bold flex items-center justify-center gap-2 w-full touch-active"
    >
      <RotateCcw className="w-4 h-4" />
      Reset All
    </button>
  )

  const renderSuspectActionButton = (suspect) => {
    const isInterrogated = interrogated.includes(suspect)
    const canInterrogateThis = canInterrogate && !isInterrogated
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (canInterrogateThis) onInterrogate(suspect)
        }}
        disabled={!canInterrogateThis}
        className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
          canInterrogateThis
            ? 'bg-purple-600 text-white hover:bg-purple-500'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <UserSearch className="w-3 h-3" />
        {isInterrogated ? 'Done' : 'Ask'}
      </button>
    )
  }

  const renderWeaponActionButton = (weapon) => {
    if (!hasForensicsKit) return null
    const isExamined = examinedWeapons.includes(weapon)
    const canExamineThis = canExamine && !isExamined
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (canExamineThis) onExamine(weapon)
        }}
        disabled={!canExamineThis}
        className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
          canExamineThis
            ? 'bg-cyan-600 text-white hover:bg-cyan-500'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Microscope className="w-3 h-3" />
        {isExamined ? 'Done' : 'Test'}
      </button>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory':
        return <SummaryPanel summary={summary} />
      case 'suspects':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400 px-2 pb-2 border-b border-gray-700">
              <span>Tap name to mark, button to interrogate</span>
              <span className="text-purple-400 font-bold">{interrogationsLeft} left</span>
            </div>
            <DeductionList
              items={suspects}
              itemStates={deductionState.suspects}
              onSetState={deductionActions.setSuspectState}
              interrogated={interrogated}
              renderActionButton={renderSuspectActionButton}
            />
          </div>
        )
      case 'weapons':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400 px-2 pb-2 border-b border-gray-700">
              <span>{hasForensicsKit ? 'Tap name to mark, button to examine' : 'Find Forensics Kit to examine'}</span>
              {hasForensicsKit && <span className="text-cyan-400 font-bold">{forensicsUsesLeft} left</span>}
            </div>
            <DeductionList
              items={weapons}
              itemStates={deductionState.weapons}
              onSetState={deductionActions.setWeaponState}
              examinedWeapons={examinedWeapons}
              renderActionButton={renderWeaponActionButton}
            />
          </div>
        )
      case 'rooms':
        return (
          <DeductionList
            items={rooms}
            itemStates={deductionState.rooms}
            onSetState={deductionActions.setRoomState}
          />
        )
      default:
        return null
    }
  }

  // Desktop view - show all sections in grid
  if (!isMobile) {
    return (
      <ResponsiveModal
        isOpen={true}
        onClose={onClose}
        title="DEDUCTION BOARD"
        size="full"
        borderColor="border-teal-600"
      >
        {/* Legend at top */}
        <Legend isMobile={false} />

        <div className="grid gap-4 grid-cols-4">
          <div className="bg-gray-800 rounded-lg p-4 border-2 border-yellow-500">
            <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              YOUR THEORY
            </h3>
            <SummaryPanel summary={summary} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-2 border-blue-500">
            <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                SUSPECTS
              </span>
              <span className="text-sm text-purple-400">{interrogationsLeft} interrogations</span>
            </h3>
            <DeductionList
              items={suspects}
              itemStates={deductionState.suspects}
              onSetState={deductionActions.setSuspectState}
              interrogated={interrogated}
              renderActionButton={renderSuspectActionButton}
            />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-2 border-red-500">
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Crosshair className="w-5 h-5" />
                WEAPONS
              </span>
              {hasForensicsKit && <span className="text-sm text-cyan-400">{forensicsUsesLeft} examinations</span>}
            </h3>
            <div className="max-h-72 overflow-y-auto">
              <DeductionList
                items={weapons}
                itemStates={deductionState.weapons}
                onSetState={deductionActions.setWeaponState}
                examinedWeapons={examinedWeapons}
                renderActionButton={renderWeaponActionButton}
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-500">
            <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              ROOMS
            </h3>
            <div className="max-h-80 overflow-y-auto">
              <DeductionList
                items={rooms}
                itemStates={deductionState.rooms}
                onSetState={deductionActions.setRoomState}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          {resetButton}
        </div>
      </ResponsiveModal>
    )
  }

  // Mobile view - tabbed interface
  return (
    <ResponsiveModal
      isOpen={true}
      onClose={onClose}
      title="DEDUCTION BOARD"
      size="full"
      borderColor="border-teal-600"
      stickyFooter={resetButton}
    >
      {/* Legend at top */}
      <Legend isMobile={true} />

      {/* Tab Bar */}
      <div className="flex justify-around border-b border-gray-700 -mx-4 px-4 mb-4">
        {TAB_CONFIG.map(tab => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {renderTabContent()}
      </div>
    </ResponsiveModal>
  )
}

export default DeductionBoardModal
