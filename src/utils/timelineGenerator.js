import { SUSPECTS, SUSPECT_PROFILES } from '../data/suspects'
import { TIME_SLOTS, ALIBI_STRENGTH, ALIBI_TEMPLATES, WITNESS_TYPES } from '../data/timeline'
import { randomElement } from './gameHelpers'

/**
 * Generates a random alibi activity for a time slot.
 * @param {string} slotId - Time slot identifier
 * @returns {string} Alibi activity description
 */
function getAlibiActivity(slotId) {
  const activityTypes = {
    early: ['socializing', 'hobby'],
    dinner: ['dining'],
    murder: ['private', 'working', 'hobby'],
    late: ['socializing', 'private', 'hobby'],
    night: ['private', 'working']
  }

  const types = activityTypes[slotId] || ['socializing']
  const selectedType = randomElement(types)
  return randomElement(ALIBI_TEMPLATES[selectedType])
}

/**
 * Gets a witness description based on alibi strength.
 * @param {string} strength - Alibi strength level
 * @returns {string} Witness description
 */
function getWitnessDescription(strength) {
  switch (strength) {
    case ALIBI_STRENGTH.CONFIRMED:
      return randomElement([WITNESS_TYPES.MULTIPLE, WITNESS_TYPES.GUEST])
    case ALIBI_STRENGTH.PARTIAL:
      return WITNESS_TYPES.STAFF
    case ALIBI_STRENGTH.WEAK:
      return WITNESS_TYPES.NONE
    case ALIBI_STRENGTH.NONE:
      return WITNESS_TYPES.NONE
    default:
      return WITNESS_TYPES.NONE
  }
}

/**
 * Generates alibi strength for a specific time slot.
 * Killers have weak/no alibi during murder time slot.
 * @param {boolean} isKiller - Whether suspect is a killer
 * @param {boolean} isCriticalSlot - Whether this is the murder time slot
 * @returns {string} Alibi strength level
 */
function generateAlibiStrength(isKiller, isCriticalSlot) {
  if (isKiller && isCriticalSlot) {
    // Killers always have weak or no alibi during murder
    return Math.random() < 0.6 ? ALIBI_STRENGTH.NONE : ALIBI_STRENGTH.WEAK
  }

  if (isKiller) {
    // Killers have generally weaker alibis overall
    const roll = Math.random()
    if (roll < 0.2) return ALIBI_STRENGTH.CONFIRMED
    if (roll < 0.5) return ALIBI_STRENGTH.PARTIAL
    if (roll < 0.8) return ALIBI_STRENGTH.WEAK
    return ALIBI_STRENGTH.NONE
  }

  // Innocent suspects have generally stronger alibis
  const roll = Math.random()
  if (roll < 0.4) return ALIBI_STRENGTH.CONFIRMED
  if (roll < 0.7) return ALIBI_STRENGTH.PARTIAL
  if (roll < 0.9) return ALIBI_STRENGTH.WEAK
  return ALIBI_STRENGTH.NONE
}

/**
 * Generates a single alibi entry for a suspect and time slot.
 * @param {string} suspect - Suspect name
 * @param {Object} slot - Time slot object
 * @param {boolean} isKiller - Whether suspect is a killer
 * @returns {Object} Alibi entry
 */
function generateAlibiEntry(suspect, slot, isKiller) {
  const strength = generateAlibiStrength(isKiller, slot.isCritical)
  const activity = getAlibiActivity(slot.id)
  const witness = getWitnessDescription(strength)

  return {
    slotId: slot.id,
    timeLabel: slot.label,
    activity,
    strength,
    witness,
    isCritical: slot.isCritical || false,
    // Add tells for the player to notice
    tell: isKiller && slot.isCritical
      ? randomElement([
          'Seemed nervous when discussing this time.',
          'Provided vague details.',
          'Story changed slightly on repetition.',
          'Could not name specific witnesses.'
        ])
      : null
  }
}

/**
 * Generates a complete timeline for a suspect.
 * @param {string} suspect - Suspect name
 * @param {Array} killers - Array of killer names
 * @returns {Object} Complete timeline with all time slots
 */
function generateSuspectTimeline(suspect, killers) {
  const isKiller = killers.includes(suspect)
  const profile = SUSPECT_PROFILES[suspect]

  return {
    suspect,
    location: profile.location,
    slots: TIME_SLOTS.map(slot => generateAlibiEntry(suspect, slot, isKiller))
  }
}

/**
 * Generates timelines for all suspects based on the solution.
 * @param {Object} solution - Murder solution with killers array
 * @returns {Object} Map of suspect -> timeline object
 */
export function generateTimelines(solution) {
  const timelines = {}

  SUSPECTS.forEach(suspect => {
    timelines[suspect] = generateSuspectTimeline(suspect, solution.suspects)
  })

  return timelines
}

/**
 * Checks if a suspect has an alibi gap during murder time.
 * @param {Object} timeline - Suspect's timeline
 * @returns {boolean} True if no alibi during murder
 */
export function hasAlibiGap(timeline) {
  const murderSlot = timeline.slots.find(s => s.isCritical)
  return murderSlot && (
    murderSlot.strength === ALIBI_STRENGTH.NONE ||
    murderSlot.strength === ALIBI_STRENGTH.WEAK
  )
}

/**
 * Gets summary statistics for a suspect's alibis.
 * @param {Object} timeline - Suspect's timeline
 * @returns {Object} Summary with counts by strength
 */
export function getAlibiSummary(timeline) {
  const summary = {
    confirmed: 0,
    partial: 0,
    weak: 0,
    none: 0,
    hasCriticalGap: false
  }

  timeline.slots.forEach(slot => {
    switch (slot.strength) {
      case ALIBI_STRENGTH.CONFIRMED:
        summary.confirmed++
        break
      case ALIBI_STRENGTH.PARTIAL:
        summary.partial++
        break
      case ALIBI_STRENGTH.WEAK:
        summary.weak++
        break
      case ALIBI_STRENGTH.NONE:
        summary.none++
        break
    }

    if (slot.isCritical && (slot.strength === ALIBI_STRENGTH.NONE || slot.strength === ALIBI_STRENGTH.WEAK)) {
      summary.hasCriticalGap = true
    }
  })

  return summary
}
