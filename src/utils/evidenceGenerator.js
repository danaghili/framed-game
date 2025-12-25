import { ROOMS } from '../data/rooms'
import { SUSPECTS, SUSPECT_PROFILES } from '../data/suspects'
import { BODY_CONDITIONS } from '../data/weapons'
import { RELATIONSHIP_TYPES } from '../data/relationships'
import { EVIDENCE_CATEGORY } from '../data/constants'
import { shuffle, randomElement } from './gameHelpers'
import { generatePhysicalEvidence } from './physicalEvidenceGenerator'

/**
 * Generates motive-related evidence with financial stakes.
 */
function generateMotiveClue(suspect) {
  const profile = SUSPECT_PROFILES[suspect]
  const stake = profile.financialStake.toLocaleString()

  const clueTemplates = [
    `Financial records reveal ${suspect} stood to lose £${stake} if the victim's plans succeeded.`,
    `A letter found indicates the victim was threatening ${suspect}'s interests worth over £${stake}.`,
    `${suspect}'s motive is clear: ${profile.motiveDetails.split('.')[0]}.`,
    `Documents show ${suspect} had compelling reason to silence the victim. Stakes: £${stake}.`
  ]

  return randomElement(clueTemplates)
}

/**
 * Places crime scene evidence at the murder location.
 */
function placeCrimeSceneEvidence(evidenceMap, solution) {
  const bodyCondition = BODY_CONDITIONS[solution.weapon]
  const crimeSceneClue = solution.isConspiracy
    ? `Victim's body found here. Time of death: 9:15pm. Condition: ${bodyCondition} Signs of multiple perpetrators present.`
    : `Victim's body found here. Time of death: 9:15pm. Condition: ${bodyCondition}`

  evidenceMap[solution.room] = {
    type: 'physical',
    clue: crimeSceneClue,
    category: EVIDENCE_CATEGORY.CRIME_SCENE,
    real: true,
    found: false
  }
}

/**
 * Places real clues pointing to the killer(s).
 */
function placeRealClues(evidenceMap, solution, availableRooms) {
  const realClueRooms = availableRooms.slice(0, solution.isConspiracy ? 6 : 4)

  if (solution.isConspiracy) {
    // Evidence for conspiracy - includes relationship hints
    evidenceMap[realClueRooms[0]] = {
      type: 'document',
      clue: `Secret correspondence between ${solution.suspects[0]} and ${solution.suspects[1]} discussing "the plan." Their close relationship evident in the intimate tone.`,
      category: EVIDENCE_CATEGORY.CONSPIRACY,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[1]] = {
      type: 'witness',
      clue: `Witness saw ${solution.suspects[0]} and ${solution.suspects[1]} meeting secretly earlier that evening. They appeared very familiar with each other.`,
      category: EVIDENCE_CATEGORY.CONSPIRACY,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[2]] = {
      type: 'document',
      clue: generateMotiveClue(solution.suspects[0]),
      category: EVIDENCE_CATEGORY.MOTIVE,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[3]] = {
      type: 'document',
      clue: generateMotiveClue(solution.suspects[1]),
      category: EVIDENCE_CATEGORY.MOTIVE,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[4]] = {
      type: 'physical',
      clue: `${solution.weapon} found with fingerprints from multiple people.`,
      category: EVIDENCE_CATEGORY.WEAPON,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[5]] = {
      type: 'witness',
      clue: `Both ${solution.suspects[0]} and ${solution.suspects[1]} were seen near ${solution.room} around the time of death.`,
      category: EVIDENCE_CATEGORY.TESTIMONY,
      real: true,
      found: false
    }
  } else {
    // Evidence for single killer
    evidenceMap[realClueRooms[0]] = {
      type: 'document',
      clue: generateMotiveClue(solution.suspects[0]),
      category: EVIDENCE_CATEGORY.MOTIVE,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[1]] = {
      type: 'physical',
      clue: `${solution.weapon} found here with ${solution.suspects[0]}'s fingerprints.`,
      category: EVIDENCE_CATEGORY.WEAPON,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[2]] = {
      type: 'witness',
      clue: `Witness saw ${solution.suspects[0]} near ${solution.room} around the time of death.`,
      category: EVIDENCE_CATEGORY.TESTIMONY,
      real: true,
      found: false
    }

    evidenceMap[realClueRooms[3]] = {
      type: 'document',
      clue: `Records show ${solution.suspects[0]} had access to ${solution.room} that evening.`,
      category: EVIDENCE_CATEGORY.OPPORTUNITY,
      real: true,
      found: false
    }
  }

  return realClueRooms.length
}

/**
 * Places red herrings for innocent suspects.
 */
function placeRedHerrings(evidenceMap, solution, availableRooms) {
  const otherSuspects = SUSPECTS.filter(s => !solution.suspects.includes(s))
  const redHerringRooms = availableRooms.slice(0, 4)

  const redHerringClues = [
    (suspect) => `${suspect} was seen acting suspiciously in this area earlier.`,
    (suspect) => `Witness reports ${suspect} was nearby around the time of the murder.`,
    (suspect) => `Staff member noticed ${suspect} behaving oddly this evening.`,
    (suspect) => `${suspect} was observed leaving this room in a hurry.`
  ]

  redHerringRooms.forEach((room, idx) => {
    if (otherSuspects[idx]) {
      const clueGenerator = randomElement(redHerringClues)
      evidenceMap[room] = {
        type: 'witness',
        clue: clueGenerator(otherSuspects[idx]),
        category: EVIDENCE_CATEGORY.RED_HERRING,
        real: false,
        found: false
      }
    }
  })

  return redHerringRooms.length
}

/**
 * Places special items (Forensics Kit, Master Key).
 */
function placeSpecialItems(evidenceMap, remainingRooms) {
  const shuffledRemaining = shuffle(remainingRooms)

  // Place Forensics Kit
  if (shuffledRemaining[0]) {
    evidenceMap[shuffledRemaining[0]] = {
      type: 'item',
      clue: `Found a Forensics Kit! You can now examine up to 5 weapons to match them against the crime scene.`,
      category: EVIDENCE_CATEGORY.ITEM,
      real: false,
      found: false,
      isForensicsKit: true
    }
  }

  // Place Master Key
  if (shuffledRemaining[1]) {
    evidenceMap[shuffledRemaining[1]] = {
      type: 'item',
      clue: `Found the Master Key! You can now block one room to hinder your opponent's investigation.`,
      category: EVIDENCE_CATEGORY.ITEM,
      real: false,
      found: false,
      isMasterKey: true
    }
  }

  return 2
}

/**
 * Fills remaining rooms with neutral clues.
 */
function fillRemainingRooms(evidenceMap, remainingRooms) {
  remainingRooms.forEach(room => {
    evidenceMap[room] = {
      type: 'physical',
      clue: `General investigation notes. Nothing conclusive found here.`,
      category: EVIDENCE_CATEGORY.NEUTRAL,
      real: false,
      found: false
    }
  })
}

/**
 * Places physical evidence in rooms near the crime scene.
 */
function placePhysicalEvidence(evidenceMap, solution, availableRooms) {
  const physicalClues = generatePhysicalEvidence(solution)

  // Place physical evidence in available rooms
  physicalClues.forEach((clue, index) => {
    if (availableRooms[index]) {
      evidenceMap[availableRooms[index]] = clue
    }
  })

  return physicalClues.length
}

/**
 * Generates the evidence map for a new game based on the solution.
 * @param {Object} solution - The murder solution
 * @returns {Object} Map of room -> evidence object
 */
export function generateEvidenceMap(solution) {
  const evidenceMap = {}

  // 1. Crime scene evidence (always at murder location)
  placeCrimeSceneEvidence(evidenceMap, solution)

  // Get available rooms (excluding crime scene)
  let availableRooms = shuffle(ROOMS.filter(r => r !== solution.room))

  // 2. Physical evidence (footprints, hair, etc.)
  const physicalCount = placePhysicalEvidence(evidenceMap, solution, availableRooms)
  availableRooms = availableRooms.slice(physicalCount)

  // 3. Real clues pointing to killer(s)
  const realCluesCount = placeRealClues(evidenceMap, solution, availableRooms)
  availableRooms = availableRooms.slice(realCluesCount)

  // 4. Red herrings for innocent suspects
  const redHerringCount = placeRedHerrings(evidenceMap, solution, availableRooms)
  availableRooms = availableRooms.slice(redHerringCount)

  // 5. Special items (Forensics Kit, Master Key)
  const itemCount = placeSpecialItems(evidenceMap, availableRooms)
  availableRooms = availableRooms.slice(itemCount)

  // 6. Fill remaining rooms with neutral clues
  fillRemainingRooms(evidenceMap, availableRooms)

  return evidenceMap
}
