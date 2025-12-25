import { useState } from 'react'
import { Check, X, HelpCircle, Target, RotateCcw, Users, Crosshair, MapPin, UserSearch, Microscope } from 'lucide-react'
import { DEDUCTION_STATE } from '../hooks/useDeductionBoard'

const STATE_CONFIG = {
  [DEDUCTION_STATE.UNKNOWN]: { label: '?', color: 'bg-gray-600', icon: HelpCircle },
  [DEDUCTION_STATE.POSSIBLE]: { label: 'Maybe', color: 'bg-yellow-600', icon: HelpCircle },
  [DEDUCTION_STATE.RULED_OUT]: { label: 'No', color: 'bg-red-600', icon: X },
  [DEDUCTION_STATE.SUSPECTED]: { label: 'YES', color: 'bg-green-600', icon: Check }
}

const TABS = [
  { id: 'theory', label: 'Theory', icon: Target, color: 'text-yellow-400', border: 'border-yellow-500' },
  { id: 'suspects', label: 'Suspects', icon: Users, color: 'text-blue-400', border: 'border-blue-500' },
  { id: 'weapons', label: 'Weapons', icon: Crosshair, color: 'text-red-400', border: 'border-red-500' },
  { id: 'rooms', label: 'Rooms', icon: MapPin, color: 'text-purple-400', border: 'border-purple-500' }
]

const DeductionItem = ({ name, state, onCycle, tag, tagColor, actionButton }) => {
  const config = STATE_CONFIG[state]
  const Icon = config.icon
  const isRuledOut = state === DEDUCTION_STATE.RULED_OUT

  return (
    <div
      className={`flex items-center justify-between p-2 rounded transition-colors ${
        isRuledOut ? 'opacity-50' : ''
      }`}
    >
      <div
        onClick={onCycle}
        className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1"
      >
        <span className={`text-xs truncate ${
          isRuledOut ? 'line-through text-gray-500'
            : state === DEDUCTION_STATE.SUSPECTED ? 'text-green-300 font-bold'
            : 'text-white'
        }`}>
          {name}
        </span>
        {tag && (
          <span className={`text-[10px] px-1 py-0.5 rounded ${tagColor}`}>{tag}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {actionButton}
        <span
          onClick={onCycle}
          className={`${config.color} px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5 cursor-pointer`}
        >
          <Icon className="w-2.5 h-2.5" />
          {config.label}
        </span>
      </div>
    </div>
  )
}

const InlineDeductionBoard = ({
  suspects,
  weapons,
  rooms,
  deductionState,
  deductionActions,
  summary,
  onInterrogate,
  onExamine,
  interrogationsLeft = 0,
  interrogated = [],
  hasForensicsKit = false,
  forensicsUsesLeft = 0,
  examinedWeapons = [],
  gameOver = false
}) => {
  const [activeTab, setActiveTab] = useState('theory')

  const cycleState = (item, category) => {
    const states = Object.values(DEDUCTION_STATE)
    const currentState = deductionState[category][item].state
    const nextIndex = (states.indexOf(currentState) + 1) % states.length
    const setFn = category === 'suspects' ? deductionActions.setSuspectState
      : category === 'weapons' ? deductionActions.setWeaponState
      : deductionActions.setRoomState
    setFn(item, states[nextIndex])
  }

  const canInterrogate = interrogationsLeft > 0 && !gameOver
  const canExamine = hasForensicsKit && forensicsUsesLeft > 0 && !gameOver

  return (
    <div className="bg-gray-800 border-2 border-teal-600 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 px-3 py-2 flex items-center justify-between border-b border-gray-700">
        <h3 className="text-sm font-bold text-teal-400">DEDUCTION BOARD</h3>
        <button
          onClick={deductionActions.clearAll}
          className="text-gray-400 hover:text-white p-1"
          title="Reset All"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="px-3 py-2 bg-gray-900/50 border-b border-gray-700 flex justify-center gap-3">
        {Object.entries(STATE_CONFIG).map(([key, config]) => {
          const Icon = config.icon
          return (
            <span key={key} className={`${config.color} px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5`}>
              <Icon className="w-2.5 h-2.5" />
              {config.label}
            </span>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? `${tab.border} ${tab.color}`
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        {activeTab === 'theory' && (
          <div className="space-y-3">
            <div className="bg-gray-900 rounded p-3">
              <div className="text-[10px] text-gray-500 uppercase">Killer(s)</div>
              {summary.suspectedSuspects.length > 0 ? (
                <div className="text-green-400 font-bold">{summary.suspectedSuspects.join(' & ')}</div>
              ) : (
                <div className="text-gray-500 text-sm italic">Not determined</div>
              )}
            </div>
            <div className="bg-gray-900 rounded p-3">
              <div className="text-[10px] text-gray-500 uppercase">Weapon</div>
              {summary.suspectedWeapons.length === 1 ? (
                <div className="text-green-400 font-bold">{summary.suspectedWeapons[0]}</div>
              ) : summary.suspectedWeapons.length > 1 ? (
                <div className="text-yellow-400 text-sm">{summary.suspectedWeapons.length} possibilities</div>
              ) : (
                <div className="text-gray-500 text-sm italic">Not determined</div>
              )}
            </div>
            <div className="bg-gray-900 rounded p-3">
              <div className="text-[10px] text-gray-500 uppercase">Location</div>
              {summary.suspectedRooms.length === 1 ? (
                <div className="text-green-400 font-bold">{summary.suspectedRooms[0]}</div>
              ) : summary.suspectedRooms.length > 1 ? (
                <div className="text-yellow-400 text-sm">{summary.suspectedRooms.length} possibilities</div>
              ) : (
                <div className="text-gray-500 text-sm italic">Not determined</div>
              )}
            </div>
            <div className="text-center text-xs text-gray-500">
              Eliminated: {summary.ruledOutSuspects.length} suspects, {summary.ruledOutWeapons.length} weapons, {summary.ruledOutRooms.length} rooms
            </div>
            {summary.readyToAccuse && (
              <div className="p-2 bg-green-900/50 border border-green-600 rounded text-center text-green-400 text-sm font-bold">
                Ready to Accuse!
              </div>
            )}
          </div>
        )}

        {activeTab === 'suspects' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-2 pb-1 border-b border-gray-700">
              <span>Click name to mark, button to interrogate</span>
              <span className="text-purple-400 font-bold">{interrogationsLeft} left</span>
            </div>
            {suspects.map(s => {
              const isInterrogated = interrogated.includes(s)
              const canInterrogateThis = canInterrogate && !isInterrogated

              return (
                <DeductionItem
                  key={s}
                  name={s}
                  state={deductionState.suspects[s].state}
                  onCycle={() => cycleState(s, 'suspects')}
                  tag={isInterrogated ? 'Q' : null}
                  tagColor="bg-purple-900/50 text-purple-400"
                  actionButton={
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (canInterrogateThis) onInterrogate(s)
                      }}
                      disabled={!canInterrogateThis}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                        canInterrogateThis
                          ? 'bg-purple-600 text-white hover:bg-purple-500'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                      title={isInterrogated ? 'Already interrogated' : canInterrogate ? 'Interrogate' : 'No interrogations left'}
                    >
                      <UserSearch className="w-2.5 h-2.5" />
                      {isInterrogated ? 'Done' : 'Ask'}
                    </button>
                  }
                />
              )
            })}
          </div>
        )}

        {activeTab === 'weapons' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-2 pb-1 border-b border-gray-700">
              <span>{hasForensicsKit ? 'Click name to mark, button to examine' : 'Find Forensics Kit to examine'}</span>
              {hasForensicsKit && <span className="text-cyan-400 font-bold">{forensicsUsesLeft} left</span>}
            </div>
            {weapons.map(w => {
              const isExamined = examinedWeapons.includes(w)
              const canExamineThis = canExamine && !isExamined

              return (
                <DeductionItem
                  key={w}
                  name={w}
                  state={deductionState.weapons[w].state}
                  onCycle={() => cycleState(w, 'weapons')}
                  tag={isExamined ? 'E' : null}
                  tagColor="bg-cyan-900/50 text-cyan-400"
                  actionButton={
                    hasForensicsKit ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (canExamineThis) onExamine(w)
                        }}
                        disabled={!canExamineThis}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          canExamineThis
                            ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                        title={isExamined ? 'Already examined' : canExamine ? 'Examine weapon' : 'No examinations left'}
                      >
                        <Microscope className="w-2.5 h-2.5" />
                        {isExamined ? 'Done' : 'Test'}
                      </button>
                    ) : null
                  }
                />
              )
            })}
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-2">
            {rooms.map(r => (
              <DeductionItem
                key={r}
                name={r}
                state={deductionState.rooms[r].state}
                onCycle={() => cycleState(r, 'rooms')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InlineDeductionBoard
