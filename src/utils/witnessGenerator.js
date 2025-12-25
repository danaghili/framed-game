import { SUSPECTS, SUSPECT_PROFILES } from '../data/suspects'
import { ROOMS } from '../data/rooms'
import {
  WITNESS_CATEGORIES,
  CORROBORATING_STATEMENTS,
  CONTRADICTING_STATEMENTS,
  NEUTRAL_STATEMENTS
} from '../data/witnesses'
import { TIME_SLOTS } from '../data/timeline'
import { randomElement, shuffle } from './gameHelpers'

/**
 * Generates a witness name based on category.
 * @param {string} category - Witness category (staff, guest, family)
 * @returns {string} Witness name/title
 */
function generateWitnessName(category) {
  const config = WITNESS_CATEGORIES[category.toUpperCase()]
  if (!config) return 'A witness'

  const title = randomElement(config.examples)
  const names = ['Thompson', 'Williams', 'Davies', 'Evans', 'Roberts', 'Hughes', 'Morgan']
  return `${title} ${randomElement(names)}`
}

/**
 * Formats a statement template with suspect and context.
 * @param {string} template - Statement template with placeholders
 * @param {string} suspect - Suspect name
 * @param {Object} context - Additional context (location, time, etc.)
 * @returns {string} Formatted statement
 */
function formatStatement(template, suspect, context = {}) {
  let result = template.replace('{suspect}', suspect)

  if (context.location) {
    result = result.replace('{location}', context.location)
  }
  if (context.time) {
    result = result.replace('{time}', context.time)
  }

  return result
}

/**
 * Generates corroborating witness statement for innocent suspect.
 * @param {string} suspect - Suspect name
 * @returns {Object} Witness statement object
 */
function generateCorroboratingStatement(suspect) {
  const profile = SUSPECT_PROFILES[suspect]
  const category = Math.random() < 0.6 ? 'STAFF' : 'GUEST'

  const statementType = randomElement(['location', 'activity', 'demeanor'])
  const templates = CORROBORATING_STATEMENTS[statementType]
  const template = randomElement(templates)

  const timeSlot = randomElement(TIME_SLOTS.filter(s => !s.isCritical))

  const statement = formatStatement(template, suspect, {
    location: profile.location,
    time: timeSlot.label.split(' - ')[0]
  })

  return {
    witness: generateWitnessName(category),
    category,
    statement,
    reliability: category === 'STAFF' ? 'HIGH' : 'MEDIUM',
    supports: suspect,
    type: 'corroborating'
  }
}

/**
 * Generates contradicting witness statement for killer.
 * @param {string} suspect - Suspect name
 * @param {string} crimeRoom - Room where murder occurred
 * @returns {Object} Witness statement object
 */
function generateContradictingStatement(suspect, crimeRoom) {
  const profile = SUSPECT_PROFILES[suspect]
  const category = Math.random() < 0.7 ? 'STAFF' : 'GUEST'

  const statementType = randomElement(['location', 'sighting', 'demeanor'])
  const templates = CONTRADICTING_STATEMENTS[statementType]
  const template = randomElement(templates)

  // Murder time
  const murderSlot = TIME_SLOTS.find(s => s.isCritical)

  const statement = formatStatement(template, suspect, {
    location: statementType === 'sighting' ? crimeRoom : profile.location,
    time: murderSlot.label.split(' - ')[0]
  })

  return {
    witness: generateWitnessName(category),
    category,
    statement,
    reliability: category === 'STAFF' ? 'HIGH' : 'MEDIUM',
    contradicts: suspect,
    type: 'contradicting'
  }
}

/**
 * Generates neutral statement that doesn't help either way.
 * @param {string} suspect - Suspect name
 * @returns {Object} Witness statement object
 */
function generateNeutralStatement(suspect) {
  const category = randomElement(['STAFF', 'GUEST', 'FAMILY'])
  const template = randomElement(NEUTRAL_STATEMENTS)
  const statement = formatStatement(template, suspect, {})

  return {
    witness: generateWitnessName(category),
    category,
    statement,
    reliability: 'LOW',
    about: suspect,
    type: 'neutral'
  }
}

/**
 * Generates all witness statements for the game.
 * @param {Object} solution - Murder solution with suspects array
 * @returns {Object} Map of suspect -> array of statements about them
 */
export function generateWitnessStatements(solution) {
  const statements = {}
  const killers = solution.suspects
  const crimeRoom = solution.room

  SUSPECTS.forEach(suspect => {
    const isKiller = killers.includes(suspect)
    const suspectStatements = []

    if (isKiller) {
      // Killers get 1-2 contradicting statements and 0-1 neutral
      const numContradicting = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < numContradicting; i++) {
        suspectStatements.push(generateContradictingStatement(suspect, crimeRoom))
      }

      if (Math.random() < 0.5) {
        suspectStatements.push(generateNeutralStatement(suspect))
      }

      // Occasionally a misleading corroborating statement (from family/biased)
      if (Math.random() < 0.3) {
        const misleading = generateCorroboratingStatement(suspect)
        misleading.category = 'FAMILY'
        misleading.reliability = 'LOW'
        misleading.witness = generateWitnessName('family')
        suspectStatements.push(misleading)
      }
    } else {
      // Innocent suspects get 1-2 corroborating statements
      const numCorroborating = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < numCorroborating; i++) {
        suspectStatements.push(generateCorroboratingStatement(suspect))
      }

      // Occasionally a neutral statement
      if (Math.random() < 0.4) {
        suspectStatements.push(generateNeutralStatement(suspect))
      }

      // Red herring: occasional contradicting statement for innocent
      if (Math.random() < 0.2) {
        const redHerring = generateContradictingStatement(suspect, randomElement(ROOMS))
        redHerring.reliability = 'LOW'
        suspectStatements.push(redHerring)
      }
    }

    statements[suspect] = shuffle(suspectStatements)
  })

  return statements
}

/**
 * Summarizes witness testimony for a suspect.
 * @param {Array} statements - Array of statements about suspect
 * @returns {Object} Summary with counts
 */
export function summarizeWitnessTestimony(statements) {
  return {
    corroborating: statements.filter(s => s.type === 'corroborating').length,
    contradicting: statements.filter(s => s.type === 'contradicting').length,
    neutral: statements.filter(s => s.type === 'neutral').length,
    highReliability: statements.filter(s => s.reliability === 'HIGH').length,
    total: statements.length
  }
}
