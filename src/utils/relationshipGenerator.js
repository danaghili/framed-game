import { SUSPECTS } from '../data/suspects'
import { RELATIONSHIP_TYPES } from '../data/relationships'

// Weighted probability for each relationship type
const TYPE_WEIGHTS = {
  secret_lovers: 1,      // Rare, STRONG
  business_partners: 2,  // Uncommon, STRONG
  married: 1,            // Rare, STRONG
  blackmail: 2,          // Uncommon, MODERATE
  family: 2,             // Uncommon, MODERATE
  employer_employee: 3,  // Common, WEAK
  rivals: 3,             // Common, WEAK
  acquaintances: 4       // Very common, WEAK
}

/**
 * Gets all unique pairs from an array.
 * For 5 suspects, returns 10 pairs.
 */
function getAllPairs(items) {
  const pairs = []
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]])
    }
  }
  return pairs
}

/**
 * Builds a weighted pool of relationship types.
 */
function getWeightedRelationshipPool() {
  const pool = []
  for (const [type, weight] of Object.entries(TYPE_WEIGHTS)) {
    for (let i = 0; i < weight; i++) {
      pool.push(type)
    }
  }
  return pool
}

/**
 * Shuffles an array in place using Fisher-Yates.
 */
function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Selects a relationship type from the weighted pool.
 */
function selectRelationshipType(pool) {
  const shuffled = shuffleArray(pool)
  return shuffled[0]
}

/**
 * Initializes an empty network structure.
 */
function initializeEmptyNetwork() {
  const network = {}
  for (const suspect of SUSPECTS) {
    network[suspect] = {}
  }
  return network
}

/**
 * Builds a random relationship network.
 */
function buildRandomNetwork() {
  const network = initializeEmptyNetwork()
  const pairs = getAllPairs(SUSPECTS)
  const pool = getWeightedRelationshipPool()

  for (const [suspectA, suspectB] of pairs) {
    const type = selectRelationshipType(pool)

    // Bidirectional assignment
    network[suspectA][suspectB] = type
    network[suspectB][suspectA] = type
  }

  return network
}

/**
 * Counts relationships by strength level.
 */
function countRelationshipsByStrength(network, strength) {
  let count = 0
  const seen = new Set()

  for (const suspect of SUSPECTS) {
    for (const [other, type] of Object.entries(network[suspect])) {
      const pairKey = [suspect, other].sort().join('-')
      if (seen.has(pairKey)) continue
      seen.add(pairKey)

      const relType = RELATIONSHIP_TYPES[type]
      if (relType && relType.strength === strength) {
        count++
      }
    }
  }

  return count
}

/**
 * Finds all conspiracy-compatible STRONG pairs.
 */
function findConspiracyCompatiblePairs(network) {
  const pairs = []
  const seen = new Set()

  for (const suspect of SUSPECTS) {
    for (const [other, type] of Object.entries(network[suspect])) {
      const pairKey = [suspect, other].sort().join('-')
      if (seen.has(pairKey)) continue
      seen.add(pairKey)

      const relType = RELATIONSHIP_TYPES[type]
      if (relType && relType.conspiracy_compatible && relType.strength === 'STRONG') {
        pairs.push([suspect, other])
      }
    }
  }

  return pairs
}

/**
 * Checks if the network has a reasonable distribution of types.
 */
function hasReasonableDistribution(network) {
  const typeCounts = {}

  for (const suspect of SUSPECTS) {
    for (const type of Object.values(network[suspect])) {
      typeCounts[type] = (typeCounts[type] || 0) + 1
    }
  }

  // Each relationship is counted twice (bidirectional), so divide by 2
  for (const type of Object.keys(typeCounts)) {
    typeCounts[type] = typeCounts[type] / 2
  }

  // Check that no single type dominates (max 4 of same type out of 10)
  const maxAllowed = 4
  for (const count of Object.values(typeCounts)) {
    if (count > maxAllowed) return false
  }

  // Check that we have at least 3 different types
  if (Object.keys(typeCounts).length < 3) return false

  return true
}

/**
 * Validates a relationship network against all constraints.
 */
function validateNetwork(network) {
  // Rule 1: At least 2 STRONG relationships exist
  const strongCount = countRelationshipsByStrength(network, 'STRONG')
  if (strongCount < 2) return false

  // Rule 2: At least 1 conspiracy-compatible STRONG pair
  const conspiracyPairs = findConspiracyCompatiblePairs(network)
  if (conspiracyPairs.length === 0) return false

  // Rule 3: Each suspect has exactly 4 relationships
  for (const suspect of SUSPECTS) {
    if (Object.keys(network[suspect]).length !== 4) return false
  }

  // Rule 4: Relationship distribution is reasonable
  if (!hasReasonableDistribution(network)) return false

  return true
}

/**
 * Builds a guaranteed valid network as fallback.
 */
function buildGuaranteedNetwork() {
  return {
    'Lady Blackwood': {
      'Dr. Sterling': 'secret_lovers',
      'Lord Ravencrest': 'business_partners',
      'Miss Hartley': 'employer_employee',
      'Colonel Ashford': 'acquaintances'
    },
    'Colonel Ashford': {
      'Lady Blackwood': 'acquaintances',
      'Dr. Sterling': 'rivals',
      'Miss Hartley': 'acquaintances',
      'Lord Ravencrest': 'blackmail'
    },
    'Dr. Sterling': {
      'Lady Blackwood': 'secret_lovers',
      'Colonel Ashford': 'rivals',
      'Miss Hartley': 'acquaintances',
      'Lord Ravencrest': 'employer_employee'
    },
    'Miss Hartley': {
      'Lady Blackwood': 'employer_employee',
      'Colonel Ashford': 'acquaintances',
      'Dr. Sterling': 'acquaintances',
      'Lord Ravencrest': 'employer_employee'
    },
    'Lord Ravencrest': {
      'Lady Blackwood': 'business_partners',
      'Colonel Ashford': 'blackmail',
      'Dr. Sterling': 'employer_employee',
      'Miss Hartley': 'employer_employee'
    }
  }
}

/**
 * Generates a valid relationship network for 5 suspects.
 * @returns {Object} Map of suspect -> { otherSuspect: relationshipType }
 */
export function generateRelationships() {
  const MAX_ATTEMPTS = 100

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const network = buildRandomNetwork()

    if (validateNetwork(network)) {
      return network
    }
  }

  // Fallback to guaranteed valid network
  return buildGuaranteedNetwork()
}

/**
 * Finds conspiracy-compatible pairs from a relationship network.
 * Used by solutionGenerator.
 */
export function getConspiracyCompatiblePairs(relationships) {
  return findConspiracyCompatiblePairs(relationships)
}
