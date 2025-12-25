import { useReducer, useMemo } from 'react'
import { generateSolution } from '../utils/solutionGenerator'
import { generateEvidenceMap } from '../utils/evidenceGenerator'
import { generateAlibiQuality } from '../utils/gameHelpers'
import { generateRelationships } from '../utils/relationshipGenerator'
import { generateTimelines } from '../utils/timelineGenerator'
import { generateWitnessStatements } from '../utils/witnessGenerator'
import { generateDocuments, getDocumentSummary } from '../utils/documentGenerator'
import { generateEvidenceChains, checkChainProgress } from '../utils/evidenceChainManager'
import { checkForRandomEvent, applyEventEffect } from '../utils/eventManager'
import { GAME_ACTIONS, GAME_PHASE, MAX_TURNS, MAX_INTERROGATIONS, MAX_FORENSICS_USES, DIFFICULTY, DIFFICULTY_CONFIG } from '../data/constants'
import { SUSPECT_PROFILES } from '../data/suspects'
import { WEAPON_DETAILS } from '../data/weapons'

const initialState = {
  phase: GAME_PHASE.START,
  turn: MAX_TURNS,
  solution: null,
  relationships: null,
  timelines: null,
  witnesses: null,
  documents: null,
  foundDocuments: [],
  evidenceChains: [],
  triggeredEvents: [],
  evidence: {},
  playerPosition: 'Grand Hall',
  opponentPosition: 'Library',
  playerClues: [],
  opponentClues: [],
  gameLog: [],
  blockedRooms: [],
  interrogated: [],
  examinedWeapons: [],
  interrogationsLeft: MAX_INTERROGATIONS,
  hasForensicsKit: false,
  forensicsUsesLeft: 0,
  hasMasterKey: false,
  winner: null,
  selectedAction: 'search',
  discoveredTraits: {}
}

function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.START_GAME: {
      const difficulty = action.payload?.difficulty || DIFFICULTY.NORMAL
      const config = DIFFICULTY_CONFIG[difficulty]
      const relationships = generateRelationships()
      const solution = generateSolution(relationships, config.conspiracyChance)
      const evidence = generateEvidenceMap(solution)
      const timelines = generateTimelines(solution)
      const witnesses = generateWitnessStatements(solution)
      const documents = generateDocuments(solution)
      const evidenceChains = generateEvidenceChains(solution)
      return {
        ...initialState,
        phase: GAME_PHASE.PLAYING,
        difficulty,
        turn: config.turns,
        interrogationsLeft: config.interrogations,
        forensicsUsesLeft: 0,
        maxForensicsUses: config.forensicsUses,
        relationships,
        solution,
        evidence,
        timelines,
        witnesses,
        documents,
        evidenceChains,
        gameLog: [
          `Difficulty: ${config.label} - ${config.turns} turns, ${config.interrogations} interrogations`,
          'Your opponent is also investigating. Move fast!',
          'Investigation begins. Find evidence, interrogate suspects, examine weapons.'
        ]
      }
    }

    case GAME_ACTIONS.SEARCH_ROOM: {
      const { room } = action.payload
      const newState = { ...state }
      const logs = []

      // Check if room is blocked
      if (state.blockedRooms.includes(room)) {
        logs.push(`${room} is blocked! You waste your turn.`)
        return {
          ...newState,
          playerPosition: room,
          gameLog: [...logs, ...state.gameLog].slice(0, 10),
          turn: state.turn - 1,
          phase: state.turn - 1 <= 0 ? GAME_PHASE.GAME_OVER : state.phase,
          winner: state.turn - 1 <= 0 ? 'police' : null
        }
      }

      newState.playerPosition = room

      // Check for evidence in room
      if (state.evidence[room] && !state.evidence[room].found) {
        const foundEvidence = state.evidence[room]

        // Check if it's a special item
        if (foundEvidence.isForensicsKit) {
          newState.hasForensicsKit = true
          newState.forensicsUsesLeft = state.maxForensicsUses || MAX_FORENSICS_USES
          logs.push(`Found Forensics Kit in ${room}! Can examine ${state.maxForensicsUses || MAX_FORENSICS_USES} weapons.`)
        } else if (foundEvidence.isMasterKey) {
          newState.hasMasterKey = true
          logs.push(`Found Master Key in ${room}! Can block 1 room.`)
        }

        newState.playerClues = [...state.playerClues, foundEvidence.clue]
        newState.evidence = {
          ...state.evidence,
          [room]: { ...state.evidence[room], found: true }
        }

        // Track physical trait evidence
        if (foundEvidence.type === 'physical_trait' && foundEvidence.trait) {
          newState.discoveredTraits = {
            ...state.discoveredTraits,
            [foundEvidence.trait]: foundEvidence.value
          }
        }

        logs.push(`Found evidence in ${room}!`)

        // Killer attacks if you find critical crime scene evidence
        if (foundEvidence.category === 'crime scene' && Math.random() > 0.7) {
          logs.push('KILLER ATTACKS! You barely escape. Lose a turn!')
          newState.turn = Math.max(0, state.turn - 2)
        }
      } else if (state.evidence[room]?.found) {
        logs.push(`${room} already searched.`)
      } else {
        logs.push(`Nothing useful in ${room}.`)
      }

      // Check for documents in room
      if (state.documents && state.documents[room] && !state.foundDocuments.some(d => d.foundIn === room)) {
        const doc = state.documents[room]
        newState.foundDocuments = [...(state.foundDocuments || []), doc]
        newState.playerClues = [...(newState.playerClues || state.playerClues), getDocumentSummary(doc)]
        logs.push(`Found a document: ${doc.title}!`)
      }

      // Check evidence chain progress for all new clues
      const currentClues = newState.playerClues || state.playerClues
      const newClueCount = currentClues.length - state.playerClues.length
      if (newClueCount > 0 && state.evidenceChains) {
        const newClues = currentClues.slice(-newClueCount)
        let chains = state.evidenceChains
        newClues.forEach(clue => {
          const result = checkChainProgress(clue, chains)
          chains = result.updatedChains
          result.revelations.forEach(rev => {
            logs.push(`CHAIN COMPLETE: ${rev.chainName} - ${rev.revelation}`)
          })
        })
        newState.evidenceChains = chains
      }

      const finalTurn = newState.turn === state.turn ? state.turn - 1 : newState.turn

      // Check for random events
      const event = checkForRandomEvent(finalTurn, state.triggeredEvents)
      if (event) {
        const eventResult = applyEventEffect(event, { ...state, ...newState }, state.solution)
        logs.push(...eventResult.logs)
        newState.triggeredEvents = [...(state.triggeredEvents || []), event.id]
        if (eventResult.stateUpdates.playerClues) {
          newState.playerClues = eventResult.stateUpdates.playerClues
        }
        if (eventResult.stateUpdates.turn !== undefined) {
          newState.turn = eventResult.stateUpdates.turn
        }
        if (eventResult.stateUpdates.interrogationsLeft !== undefined) {
          newState.interrogationsLeft = eventResult.stateUpdates.interrogationsLeft
        }
      }

      const effectiveTurn = newState.turn !== state.turn ? newState.turn : finalTurn

      return {
        ...newState,
        turn: effectiveTurn,
        gameLog: [...logs, ...state.gameLog].slice(0, 15),
        phase: effectiveTurn <= 0 ? GAME_PHASE.GAME_OVER : state.phase,
        winner: effectiveTurn <= 0 ? 'police' : null
      }
    }

    case GAME_ACTIONS.INTERROGATE: {
      const { suspect } = action.payload

      if (state.interrogated.includes(suspect)) {
        return {
          ...state,
          gameLog: [`Already interrogated ${suspect}.`, ...state.gameLog].slice(0, 10)
        }
      }

      if (state.interrogationsLeft <= 0) {
        return {
          ...state,
          gameLog: ['No interrogations remaining! (Max 3)', ...state.gameLog].slice(0, 10)
        }
      }

      const profile = SUSPECT_PROFILES[suspect]
      const isKiller = state.solution.suspects.includes(suspect)
      const alibiQuality = generateAlibiQuality(isKiller)
      const testimony = `${suspect}: "${profile.alibi}" - ${alibiQuality} Motive: ${profile.motive}`

      const newTurn = state.turn - 1
      const logs = [`Interrogated ${suspect}! (${state.interrogationsLeft - 1} left)`]

      // Check evidence chain progress
      let updatedChains = state.evidenceChains
      if (state.evidenceChains) {
        const result = checkChainProgress(testimony, state.evidenceChains)
        updatedChains = result.updatedChains
        result.revelations.forEach(rev => {
          logs.push(`CHAIN COMPLETE: ${rev.chainName} - ${rev.revelation}`)
        })
      }

      return {
        ...state,
        interrogated: [...state.interrogated, suspect],
        interrogationsLeft: state.interrogationsLeft - 1,
        playerClues: [...state.playerClues, testimony],
        evidenceChains: updatedChains,
        gameLog: [...logs, ...state.gameLog].slice(0, 10),
        turn: newTurn,
        phase: newTurn <= 0 ? GAME_PHASE.GAME_OVER : state.phase,
        winner: newTurn <= 0 ? 'police' : null
      }
    }

    case GAME_ACTIONS.EXAMINE_WEAPON: {
      const { weapon } = action.payload

      if (!state.hasForensicsKit) {
        return {
          ...state,
          gameLog: ['Need Forensics Kit to examine weapons!', ...state.gameLog].slice(0, 10)
        }
      }

      if (state.forensicsUsesLeft <= 0) {
        return {
          ...state,
          gameLog: ['Forensics Kit exhausted! No uses remaining.', ...state.gameLog].slice(0, 10)
        }
      }

      if (state.examinedWeapons.includes(weapon)) {
        return {
          ...state,
          gameLog: [`Already examined ${weapon}.`, ...state.gameLog].slice(0, 10)
        }
      }

      const details = WEAPON_DETAILS[weapon]
      const isMatchingWeapon = weapon === state.solution.weapon
      const forensicMatch = isMatchingWeapon
        ? 'Forensic evidence is CONSISTENT with this weapon.'
        : 'Forensic evidence RULES OUT this weapon.'
      const analysis = `${weapon}: ${details.forensics} ${forensicMatch}`

      const newTurn = state.turn - 1
      const logs = [`Examined ${weapon}! (${state.forensicsUsesLeft - 1} uses left)`]

      // Check evidence chain progress
      let updatedChains = state.evidenceChains
      if (state.evidenceChains) {
        const result = checkChainProgress(analysis, state.evidenceChains)
        updatedChains = result.updatedChains
        result.revelations.forEach(rev => {
          logs.push(`CHAIN COMPLETE: ${rev.chainName} - ${rev.revelation}`)
        })
      }

      return {
        ...state,
        examinedWeapons: [...state.examinedWeapons, weapon],
        forensicsUsesLeft: state.forensicsUsesLeft - 1,
        playerClues: [...state.playerClues, analysis],
        evidenceChains: updatedChains,
        gameLog: [...logs, ...state.gameLog].slice(0, 10),
        turn: newTurn,
        phase: newTurn <= 0 ? GAME_PHASE.GAME_OVER : state.phase,
        winner: newTurn <= 0 ? 'police' : null
      }
    }

    case GAME_ACTIONS.BLOCK_ROOM: {
      const { room } = action.payload

      if (!state.hasMasterKey) {
        return {
          ...state,
          gameLog: ['Need Master Key to block rooms!', ...state.gameLog].slice(0, 10)
        }
      }

      if (state.blockedRooms.length > 0) {
        return {
          ...state,
          gameLog: ['Master Key already used! Can only block 1 room.', ...state.gameLog].slice(0, 10)
        }
      }

      const newTurn = state.turn - 1

      return {
        ...state,
        blockedRooms: [...state.blockedRooms, room],
        gameLog: [`You blocked ${room} with the Master Key!`, ...state.gameLog].slice(0, 10),
        turn: newTurn,
        phase: newTurn <= 0 ? GAME_PHASE.GAME_OVER : state.phase,
        winner: newTurn <= 0 ? 'police' : null
      }
    }

    case GAME_ACTIONS.MAKE_ACCUSATION: {
      const { suspect1, suspect2, weapon, room } = action.payload

      // Build the accusation list
      const accusedSuspects = suspect2 ? [suspect1, suspect2].sort() : [suspect1]
      const actualSuspects = [...state.solution.suspects].sort()

      // Check if accusation matches
      const suspectsMatch = JSON.stringify(accusedSuspects) === JSON.stringify(actualSuspects)
      const correct = suspectsMatch && weapon === state.solution.weapon && room === state.solution.room

      let log
      if (correct) {
        if (state.solution.isConspiracy) {
          log = `CORRECT! CONSPIRACY UNCOVERED! ${state.solution.suspects.join(' and ')} worked together with ${weapon} in the ${room}!`
        } else {
          log = `CORRECT! ${suspect1} with ${weapon} in the ${room}!`
        }
      } else {
        if (state.solution.isConspiracy) {
          log = `WRONG! It was a CONSPIRACY! ${state.solution.suspects.join(' and ')} with ${state.solution.weapon} in the ${state.solution.room}`
        } else {
          log = `WRONG! The real answer was ${state.solution.suspects[0]} with ${state.solution.weapon} in the ${state.solution.room}`
        }
      }

      return {
        ...state,
        phase: GAME_PHASE.GAME_OVER,
        winner: correct ? 'player' : 'opponent',
        gameLog: [log, ...state.gameLog].slice(0, 10)
      }
    }

    case GAME_ACTIONS.OPPONENT_MOVE: {
      const { moveType, room, suspect, foundEvidence, accusation } = action.payload
      const logs = []
      let newState = { ...state }

      if (moveType === 'search') {
        newState.opponentPosition = room
        if (foundEvidence) {
          newState.opponentClues = [...state.opponentClues, `Opponent found evidence in ${room}`]
          logs.push(`Opponent searched ${room}`)
        }
      } else if (moveType === 'interrogate') {
        newState.opponentClues = [...state.opponentClues, `Interrogated ${suspect}`]
        logs.push(`Opponent interrogated ${suspect}`)
      } else if (moveType === 'accuse') {
        logs.push('Opponent is making their accusation!')
        if (accusation.correct) {
          newState.phase = GAME_PHASE.GAME_OVER
          newState.winner = 'opponent'
          if (state.solution.isConspiracy) {
            logs.push(`Opponent uncovered the conspiracy! ${state.solution.suspects.join(' and ')} with ${state.solution.weapon} in ${state.solution.room}. You lose!`)
          } else {
            logs.push(`Opponent solved it first! ${state.solution.suspects[0]} with ${state.solution.weapon} in ${state.solution.room}. You lose!`)
          }
        } else {
          logs.push("Opponent accused WRONG! They're eliminated!")
          logs.push('Keep investigating - you can still win!')
        }
      }

      return {
        ...newState,
        gameLog: [...logs, ...state.gameLog].slice(0, 10)
      }
    }

    case 'SET_SELECTED_ACTION': {
      return {
        ...state,
        selectedAction: action.payload
      }
    }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const actions = useMemo(() => ({
    startGame: (difficulty) => dispatch({ type: GAME_ACTIONS.START_GAME, payload: { difficulty } }),
    searchRoom: (room) => dispatch({ type: GAME_ACTIONS.SEARCH_ROOM, payload: { room } }),
    interrogate: (suspect) => dispatch({ type: GAME_ACTIONS.INTERROGATE, payload: { suspect } }),
    examineWeapon: (weapon) => dispatch({ type: GAME_ACTIONS.EXAMINE_WEAPON, payload: { weapon } }),
    blockRoom: (room) => dispatch({ type: GAME_ACTIONS.BLOCK_ROOM, payload: { room } }),
    makeAccusation: (suspect1, suspect2, weapon, room) => dispatch({
      type: GAME_ACTIONS.MAKE_ACCUSATION,
      payload: { suspect1, suspect2, weapon, room }
    }),
    opponentMove: (payload) => dispatch({ type: GAME_ACTIONS.OPPONENT_MOVE, payload }),
    setSelectedAction: (action) => dispatch({ type: 'SET_SELECTED_ACTION', payload: action })
  }), [])

  return { state, actions }
}
