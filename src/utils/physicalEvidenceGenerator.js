import { TRAIT_CATEGORIES } from '../data/physicalTraits'
import { SUSPECT_PROFILES } from '../data/suspects'
import { shuffle, randomElement } from './gameHelpers'

/**
 * Formats a trait value for display in evidence text.
 */
function formatTraitForEvidence(category, value) {
  if (category === 'shoeSize') return value.toString()
  return value
}

/**
 * Generates 2-3 physical evidence clues matching the killer's traits.
 * For conspiracies, generates evidence matching traits shared by both killers,
 * or separate evidence for each.
 * @param {Object} solution - The murder solution
 * @returns {Array} Array of physical evidence objects
 */
export function generatePhysicalEvidence(solution) {
  const killer = solution.suspects[0]
  const killerTraits = SUSPECT_PROFILES[killer].physicalTraits

  // For conspiracy, prefer traits shared by both killers
  let traitsToUse = killerTraits
  if (solution.isConspiracy && solution.suspects.length > 1) {
    const killer2 = solution.suspects[1]
    const killer2Traits = SUSPECT_PROFILES[killer2].physicalTraits

    // Find shared traits
    const sharedCategories = Object.keys(killerTraits).filter(
      cat => killerTraits[cat] === killer2Traits[cat]
    )

    // If we have shared traits, use those preferentially
    if (sharedCategories.length >= 2) {
      const filteredTraits = {}
      sharedCategories.forEach(cat => {
        filteredTraits[cat] = killerTraits[cat]
      })
      traitsToUse = filteredTraits
    }
  }

  // Select 2-3 random trait categories
  const availableCategories = Object.keys(traitsToUse)
  const numClues = 2 + Math.floor(Math.random() * 2)
  const selectedCategories = shuffle(availableCategories).slice(0, Math.min(numClues, availableCategories.length))

  return selectedCategories.map(category => {
    const trait = traitsToUse[category] || killerTraits[category]
    const config = TRAIT_CATEGORIES[category]
    const template = randomElement(config.evidenceTemplates)
    const formattedValue = formatTraitForEvidence(category, trait)

    return {
      type: 'physical_trait',
      category: 'Physical',
      trait: category,
      value: trait,
      clue: template.replace('{value}', formattedValue),
      real: true,
      found: false
    }
  })
}
