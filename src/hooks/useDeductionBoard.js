import { useReducer, useMemo } from 'react'
import { SUSPECTS } from '../data/suspects'
import { WEAPONS } from '../data/weapons'
import { ROOMS } from '../data/rooms'

// Deduction states for each item
export const DEDUCTION_STATE = {
  UNKNOWN: 'unknown',
  POSSIBLE: 'possible',
  RULED_OUT: 'ruled_out',
  SUSPECTED: 'suspected'
}

const DEDUCTION_ACTIONS = {
  SET_SUSPECT_STATE: 'SET_SUSPECT_STATE',
  SET_WEAPON_STATE: 'SET_WEAPON_STATE',
  SET_ROOM_STATE: 'SET_ROOM_STATE',
  ADD_NOTE: 'ADD_NOTE',
  CLEAR_ALL: 'CLEAR_ALL',
  RESET: 'RESET'
}

/**
 * Creates initial deduction state with all items as unknown.
 */
function createInitialState() {
  const suspects = {}
  const weapons = {}
  const rooms = {}

  SUSPECTS.forEach(s => {
    suspects[s] = { state: DEDUCTION_STATE.UNKNOWN, notes: '' }
  })

  WEAPONS.forEach(w => {
    weapons[w] = { state: DEDUCTION_STATE.UNKNOWN, notes: '' }
  })

  ROOMS.forEach(r => {
    rooms[r] = { state: DEDUCTION_STATE.UNKNOWN, notes: '' }
  })

  return { suspects, weapons, rooms }
}

function deductionReducer(state, action) {
  switch (action.type) {
    case DEDUCTION_ACTIONS.SET_SUSPECT_STATE: {
      const { suspect, deductionState } = action.payload
      return {
        ...state,
        suspects: {
          ...state.suspects,
          [suspect]: {
            ...state.suspects[suspect],
            state: deductionState
          }
        }
      }
    }

    case DEDUCTION_ACTIONS.SET_WEAPON_STATE: {
      const { weapon, deductionState } = action.payload
      return {
        ...state,
        weapons: {
          ...state.weapons,
          [weapon]: {
            ...state.weapons[weapon],
            state: deductionState
          }
        }
      }
    }

    case DEDUCTION_ACTIONS.SET_ROOM_STATE: {
      const { room, deductionState } = action.payload
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [room]: {
            ...state.rooms[room],
            state: deductionState
          }
        }
      }
    }

    case DEDUCTION_ACTIONS.ADD_NOTE: {
      const { category, item, note } = action.payload
      return {
        ...state,
        [category]: {
          ...state[category],
          [item]: {
            ...state[category][item],
            notes: note
          }
        }
      }
    }

    case DEDUCTION_ACTIONS.CLEAR_ALL:
      return createInitialState()

    case DEDUCTION_ACTIONS.RESET:
      return createInitialState()

    default:
      return state
  }
}

/**
 * Hook for managing the deduction board state.
 * @returns {Object} Deduction state and actions
 */
export function useDeductionBoard() {
  const [state, dispatch] = useReducer(deductionReducer, null, createInitialState)

  const actions = useMemo(() => ({
    setSuspectState: (suspect, deductionState) => dispatch({
      type: DEDUCTION_ACTIONS.SET_SUSPECT_STATE,
      payload: { suspect, deductionState }
    }),

    setWeaponState: (weapon, deductionState) => dispatch({
      type: DEDUCTION_ACTIONS.SET_WEAPON_STATE,
      payload: { weapon, deductionState }
    }),

    setRoomState: (room, deductionState) => dispatch({
      type: DEDUCTION_ACTIONS.SET_ROOM_STATE,
      payload: { room, deductionState }
    }),

    addNote: (category, item, note) => dispatch({
      type: DEDUCTION_ACTIONS.ADD_NOTE,
      payload: { category, item, note }
    }),

    clearAll: () => dispatch({ type: DEDUCTION_ACTIONS.CLEAR_ALL }),

    reset: () => dispatch({ type: DEDUCTION_ACTIONS.RESET })
  }), [])

  // Computed values
  const summary = useMemo(() => {
    const suspectedSuspects = Object.entries(state.suspects)
      .filter(([, v]) => v.state === DEDUCTION_STATE.SUSPECTED)
      .map(([k]) => k)

    const suspectedWeapons = Object.entries(state.weapons)
      .filter(([, v]) => v.state === DEDUCTION_STATE.SUSPECTED)
      .map(([k]) => k)

    const suspectedRooms = Object.entries(state.rooms)
      .filter(([, v]) => v.state === DEDUCTION_STATE.SUSPECTED)
      .map(([k]) => k)

    const ruledOutSuspects = Object.entries(state.suspects)
      .filter(([, v]) => v.state === DEDUCTION_STATE.RULED_OUT)
      .map(([k]) => k)

    const ruledOutWeapons = Object.entries(state.weapons)
      .filter(([, v]) => v.state === DEDUCTION_STATE.RULED_OUT)
      .map(([k]) => k)

    const ruledOutRooms = Object.entries(state.rooms)
      .filter(([, v]) => v.state === DEDUCTION_STATE.RULED_OUT)
      .map(([k]) => k)

    return {
      suspectedSuspects,
      suspectedWeapons,
      suspectedRooms,
      ruledOutSuspects,
      ruledOutWeapons,
      ruledOutRooms,
      readyToAccuse: suspectedSuspects.length >= 1 &&
                     suspectedWeapons.length === 1 &&
                     suspectedRooms.length === 1
    }
  }, [state])

  return { state, actions, summary }
}
