import { SUSPECTS, SUSPECT_PROFILES } from '../data/suspects'
import { WEAPONS } from '../data/weapons'
import { ROOMS } from '../data/rooms'
import { RELATIONSHIP_TYPES } from '../data/relationships'
import { CONSPIRACY_CHANCE } from '../data/constants'

// Default conspiracy chance used when not provided
const DEFAULT_CONSPIRACY_CHANCE = CONSPIRACY_CHANCE

/**
 * Checks if a suspect has adequate motive to be a killer.
 * Only STRONG or MODERATE motive suspects can be killers.
 */
function hasAdequateMotive(suspect) {
  const strength = SUSPECT_PROFILES[suspect].motiveStrength
  return strength === 'STRONG' || strength === 'MODERATE'
}

/**
 * Finds a valid conspiracy partner for the given suspect.
 * Partner must have:
 * - STRONG or MODERATE motive
 * - Conspiracy-compatible relationship with primary suspect
 * @param {string} suspect - Primary suspect name
 * @param {Object} relationships - The relationship network for this game
 * @returns {string|null} Partner name or null if none found
 */
function findConspiracyPartner(suspect, relationships) {
  // Get suspects with adequate motive who have conspiracy-compatible relationships
  const eligiblePartners = SUSPECTS.filter(s => {
    if (s === suspect) return false
    if (!hasAdequateMotive(s)) return false

    const relationshipType = relationships[suspect][s]
    const relationType = RELATIONSHIP_TYPES[relationshipType]
    return relationType?.conspiracy_compatible
  })

  // Prefer STRONG relationships
  const strongPartners = eligiblePartners.filter(s => {
    const relationshipType = relationships[suspect][s]
    const relationType = RELATIONSHIP_TYPES[relationshipType]
    return relationType?.strength === 'STRONG'
  })

  if (strongPartners.length > 0) {
    return strongPartners[Math.floor(Math.random() * strongPartners.length)]
  }

  if (eligiblePartners.length > 0) {
    return eligiblePartners[Math.floor(Math.random() * eligiblePartners.length)]
  }

  return null
}

/**
 * Generates the murder solution for a new game.
 * @param {Object} relationships - The relationship network for this game
 * @param {number} conspiracyChance - Probability of a conspiracy (0-1)
 * @returns {Object} Solution with suspects array, weapon, room, and isConspiracy flag
 */
export function generateSolution(relationships, conspiracyChance = DEFAULT_CONSPIRACY_CHANCE) {
  const isTwoKillers = Math.random() < conspiracyChance

  // Filter to suspects with STRONG or MODERATE motives
  const eligibleKillers = SUSPECTS.filter(hasAdequateMotive)

  const randomSuspect1 = eligibleKillers[Math.floor(Math.random() * eligibleKillers.length)]
  let randomSuspect2 = null

  if (isTwoKillers) {
    randomSuspect2 = findConspiracyPartner(randomSuspect1, relationships)
  }

  const randomWeapon = WEAPONS[Math.floor(Math.random() * WEAPONS.length)]
  const randomRoom = ROOMS[Math.floor(Math.random() * ROOMS.length)]

  return {
    suspects: randomSuspect2 ? [randomSuspect1, randomSuspect2] : [randomSuspect1],
    weapon: randomWeapon,
    room: randomRoom,
    isConspiracy: isTwoKillers && randomSuspect2 !== null
  }
}
