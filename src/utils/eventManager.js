import { RANDOM_EVENTS, CONFLICT_REASONS } from '../data/events'
import { SUSPECTS } from '../data/suspects'
import { ROOMS } from '../data/rooms'
import { randomElement, shuffle } from './gameHelpers'

/**
 * Checks if a random event should occur this turn.
 * @param {number} turn - Current turn number
 * @param {Array} triggeredEvents - Events already triggered this game
 * @returns {Object|null} Event object or null if no event triggers
 */
export function checkForRandomEvent(turn, triggeredEvents = []) {
  // Don't trigger events on first or last turn
  if (turn <= 1 || turn >= 14) return null

  // Filter out already triggered events
  const availableEvents = RANDOM_EVENTS.filter(
    e => !triggeredEvents.includes(e.id)
  )

  // Check each event's probability
  for (const event of shuffle(availableEvents)) {
    if (Math.random() < event.probability) {
      return event
    }
  }

  return null
}

/**
 * Generates the clue text for an event with placeholders filled in.
 * @param {Object} event - The event object
 * @param {Object} solution - The murder solution
 * @returns {string} Formatted clue text
 */
export function generateEventClue(event, solution) {
  if (!event.clueTemplate) return null

  let clue = event.clueTemplate

  // Replace placeholders
  const killers = solution.suspects
  const innocents = SUSPECTS.filter(s => !killers.includes(s))

  // {suspect} - could be killer or innocent based on context
  if (clue.includes('{suspect}')) {
    // 60% chance to reference actual killer for bonus clues
    const suspect = Math.random() < 0.6
      ? randomElement(killers)
      : randomElement(innocents)
    clue = clue.replace('{suspect}', suspect)
  }

  // {suspect1} and {suspect2} for gossip
  if (clue.includes('{suspect1}')) {
    const pair = shuffle([...SUSPECTS]).slice(0, 2)
    clue = clue.replace('{suspect1}', pair[0])
    clue = clue.replace('{suspect2}', pair[1])
  }

  // {room}
  if (clue.includes('{room}')) {
    const room = Math.random() < 0.5
      ? solution.room
      : randomElement(ROOMS.filter(r => r !== solution.room))
    clue = clue.replace('{room}', room)
  }

  // {amount}
  if (clue.includes('{amount}')) {
    const amount = randomElement([5000, 10000, 25000, 50000])
    clue = clue.replace('{amount}', amount.toLocaleString())
  }

  // {reason}
  if (clue.includes('{reason}')) {
    clue = clue.replace('{reason}', randomElement(CONFLICT_REASONS))
  }

  return clue
}

/**
 * Applies an event's effect to the game state.
 * @param {Object} event - The event object
 * @param {Object} state - Current game state
 * @param {Object} solution - The murder solution
 * @returns {Object} Updated state changes
 */
export function applyEventEffect(event, state, solution) {
  const changes = {
    logs: [`EVENT: ${event.title}`],
    stateUpdates: {},
    clue: null
  }

  switch (event.effect) {
    case 'bonus_clue': {
      const clue = generateEventClue(event, solution)
      if (clue) {
        changes.clue = clue
        changes.stateUpdates.playerClues = [...state.playerClues, clue]
      }
      break
    }

    case 'lose_turn':
      changes.stateUpdates.turn = Math.max(1, state.turn - 1)
      changes.logs.push('You lost a turn!')
      break

    case 'extra_interrogation':
      changes.stateUpdates.interrogationsLeft = state.interrogationsLeft + 1
      changes.logs.push('You gained an extra interrogation!')
      break

    case 'confusion': {
      const confusionClue = generateEventClue(event, solution)
      if (confusionClue) {
        changes.clue = confusionClue
        changes.stateUpdates.playerClues = [...state.playerClues, confusionClue]
      }
      break
    }

    case 'block_interrogation':
      // Could mark a random suspect as temporarily uninterrogatable
      // For simplicity, just add a warning log
      changes.logs.push('Some suspects may be less cooperative this turn.')
      break

    case 'atmosphere':
      // Pure flavor, no mechanical effect
      changes.logs.push(event.description)
      break

    default:
      break
  }

  return changes
}

/**
 * Gets event statistics for display.
 * @param {Array} triggeredEvents - Array of triggered event IDs
 * @returns {Object} Event statistics
 */
export function getEventStats(triggeredEvents) {
  const triggered = RANDOM_EVENTS.filter(e => triggeredEvents.includes(e.id))

  return {
    total: triggered.length,
    bonus: triggered.filter(e => e.type === 'bonus').length,
    obstacle: triggered.filter(e => e.type === 'obstacle').length,
    neutral: triggered.filter(e => e.type === 'neutral').length,
    dramatic: triggered.filter(e => e.type === 'dramatic').length
  }
}
