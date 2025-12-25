/**
 * Shuffles an array using Fisher-Yates algorithm.
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Picks a random element from an array.
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Compares two arrays for equality (order-independent).
 * @param {Array} a - First array
 * @param {Array} b - Second array
 * @returns {boolean} True if arrays contain same elements
 */
export function arraysEqual(a, b) {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, idx) => val === sortedB[idx])
}

/**
 * Generates alibi quality indicator based on killer status.
 * @param {boolean} isKiller - Whether the suspect is a killer
 * @returns {string} Alibi quality description
 */
export function generateAlibiQuality(isKiller) {
  const weakIndicators = [
    'Story has some inconsistencies.',
    'Details seem vague when pressed.',
    'Hesitated when providing details.',
    'Changed minor details during questioning.',
    'Became defensive when questioned closely.',
    'Could not provide corroborating witnesses.'
  ]

  const solidIndicators = [
    'Story is consistent and detailed.',
    'Provided specific times and locations.',
    'Alibi confirmed by independent witness.',
    'Confident and forthcoming with details.',
    'Timeline checks out with other evidence.',
    'Multiple people can verify whereabouts.'
  ]

  const indicators = isKiller ? weakIndicators : solidIndicators
  return randomElement(indicators)
}
