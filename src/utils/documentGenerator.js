import { SUSPECTS } from '../data/suspects'
import { ROOMS } from '../data/rooms'
import {
  LETTER_TEMPLATES,
  FINANCIAL_TEMPLATES,
  DIARY_TEMPLATES,
  NOTE_TEMPLATES,
  TELEGRAM_TEMPLATES,
  DOCUMENT_TYPES
} from '../data/documents'
import { randomElement, shuffle } from './gameHelpers'

/**
 * Generates a letter document.
 * @param {Object} solution - Murder solution
 * @param {boolean} isIncriminating - Whether this implicates the killer
 * @returns {Object} Generated letter document
 */
function generateLetter(solution, isIncriminating) {
  const template = randomElement(LETTER_TEMPLATES)
  const killers = solution.suspects
  const innocents = SUSPECTS.filter(s => !killers.includes(s))

  let from, to
  if (isIncriminating && solution.isConspiracy) {
    // Letter between conspirators
    from = killers[0]
    to = killers[1]
  } else if (isIncriminating) {
    // Letter from killer
    from = killers[0]
    to = randomElement(innocents)
  } else {
    // Red herring letter
    from = randomElement(innocents)
    to = randomElement(innocents.filter(s => s !== from))
  }

  const content = randomElement(template.contentOptions)

  return {
    type: template.type,
    title: template.title,
    content: template.template
      .replace('{from}', from)
      .replace('{to}', to)
      .replace('{content}', content),
    from,
    to,
    isIncriminating,
    foundIn: null // Set when placed in a room
  }
}

/**
 * Generates a financial document.
 * @param {Object} solution - Murder solution
 * @param {boolean} isIncriminating - Whether this implicates the killer
 * @returns {Object} Generated financial document
 */
function generateFinancialDoc(solution, isIncriminating) {
  const template = randomElement(FINANCIAL_TEMPLATES)
  const killers = solution.suspects
  const innocents = SUSPECTS.filter(s => !killers.includes(s))

  const suspect = isIncriminating ? randomElement(killers) : randomElement(innocents)
  const amount = randomElement(template.amounts)

  // For debt notices, pick a creditor
  const creditor = SUSPECTS.filter(s => s !== suspect)[0]
  const recipient = randomElement(SUSPECTS.filter(s => s !== suspect))

  return {
    type: template.type,
    title: template.title,
    content: template.template
      .replace('{suspect}', suspect)
      .replace('{amount}', amount.toLocaleString())
      .replace('{creditor}', creditor)
      .replace('{recipient}', recipient),
    suspect,
    amount,
    isIncriminating,
    foundIn: null
  }
}

/**
 * Generates a diary entry.
 * @param {Object} solution - Murder solution
 * @returns {Object} Generated diary document
 */
function generateDiary(solution) {
  const template = randomElement(DIARY_TEMPLATES)
  const killer = randomElement(solution.suspects)
  const content = randomElement(template.contentOptions)

  return {
    type: template.type,
    title: `${killer}'s ${template.title}`,
    content: template.template.replace('{content}', content),
    owner: killer,
    isIncriminating: true,
    foundIn: null
  }
}

/**
 * Generates a quick note.
 * @param {Object} solution - Murder solution
 * @returns {Object} Generated note document
 */
function generateNote(solution) {
  const template = randomElement(NOTE_TEMPLATES)
  const content = randomElement(template.contentOptions)

  return {
    type: template.type,
    title: template.title,
    content: template.template
      .replace('{content}', content)
      .replace('{location}', solution.room),
    isIncriminating: true,
    foundIn: null
  }
}

/**
 * Generates a telegram.
 * @param {Object} solution - Murder solution
 * @param {boolean} isIncriminating - Whether this implicates the killer
 * @returns {Object} Generated telegram document
 */
function generateTelegram(solution, isIncriminating) {
  const template = randomElement(TELEGRAM_TEMPLATES)
  const killers = solution.suspects
  const innocents = SUSPECTS.filter(s => !killers.includes(s))

  let from, to
  if (isIncriminating) {
    from = randomElement(killers)
    to = solution.isConspiracy ? killers.find(k => k !== from) : randomElement(innocents)
  } else {
    from = randomElement(innocents)
    to = randomElement(innocents.filter(s => s !== from))
  }

  const content = randomElement(template.contentOptions)

  return {
    type: template.type,
    title: template.title,
    content: template.template
      .replace('{from}', from)
      .replace('{to}', to)
      .replace('{content}', content),
    from,
    to,
    isIncriminating,
    foundIn: null
  }
}

/**
 * Generates a set of discoverable documents for the game.
 * @param {Object} solution - Murder solution
 * @returns {Object} Map of room -> document
 */
export function generateDocuments(solution) {
  const documents = {}
  const availableRooms = shuffle(ROOMS.filter(r => r !== solution.room))

  // Generate incriminating documents
  const incriminatingDocs = []

  // Conspiracy gets more documents between killers
  if (solution.isConspiracy) {
    incriminatingDocs.push(generateLetter(solution, true))
    incriminatingDocs.push(generateTelegram(solution, true))
  }

  // Always include these
  incriminatingDocs.push(generateDiary(solution))
  incriminatingDocs.push(generateNote(solution))
  incriminatingDocs.push(generateFinancialDoc(solution, true))

  // Generate red herring documents
  const redHerrings = [
    generateLetter(solution, false),
    generateFinancialDoc(solution, false)
  ]

  // Combine and shuffle
  const allDocs = shuffle([...incriminatingDocs, ...redHerrings])

  // Place in rooms
  allDocs.forEach((doc, index) => {
    if (availableRooms[index]) {
      doc.foundIn = availableRooms[index]
      documents[availableRooms[index]] = doc
    }
  })

  return documents
}

/**
 * Gets a summary text for a document (for the clue log).
 * @param {Object} document - The document
 * @returns {string} Summary text
 */
export function getDocumentSummary(document) {
  switch (document.type) {
    case DOCUMENT_TYPES.LETTER:
      return `Found ${document.title} from ${document.from} to ${document.to}`
    case DOCUMENT_TYPES.FINANCIAL:
      return `Found ${document.title} involving ${document.suspect}`
    case DOCUMENT_TYPES.DIARY:
      return `Found ${document.title}`
    case DOCUMENT_TYPES.NOTE:
      return `Found ${document.title}`
    case DOCUMENT_TYPES.TELEGRAM:
      return `Found ${document.title} from ${document.from} to ${document.to}`
    default:
      return `Found ${document.title}`
  }
}
