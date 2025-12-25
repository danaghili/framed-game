import { useCallback } from 'react'
import { ROOMS } from '../data/rooms'
import { SUSPECTS } from '../data/suspects'
import { randomElement } from '../utils/gameHelpers'

/**
 * Hook providing opponent AI decision logic.
 * Called after each player action to simulate opponent moves.
 */
export function useOpponentAI() {
  const makeMove = useCallback((gameState) => {
    const action = Math.random()

    if (action < 0.5) {
      // Search a room
      const availableRooms = ROOMS.filter(r => r !== gameState.opponentPosition)
      const targetRoom = randomElement(availableRooms)
      const foundEvidence = Math.random() > 0.3

      return {
        moveType: 'search',
        room: targetRoom,
        foundEvidence
      }
    } else if (action < 0.7) {
      // Interrogate a suspect
      const uninvestigated = SUSPECTS.filter(s => !gameState.interrogated.includes(s))
      if (uninvestigated.length > 0 && Math.random() > 0.5) {
        return {
          moveType: 'interrogate',
          suspect: randomElement(uninvestigated)
        }
      }
    }

    return { moveType: 'none' }
  }, [])

  const shouldAccuse = useCallback((gameState) => {
    const { turn, opponentClues } = gameState
    if (turn <= 4 && opponentClues.length >= 8 && Math.random() > 0.5) {
      const correct = opponentClues.length >= 10 ? Math.random() > 0.5 : Math.random() > 0.7
      return { shouldAccuse: true, correct }
    }
    return { shouldAccuse: false }
  }, [])

  return { makeMove, shouldAccuse }
}
