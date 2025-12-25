import { SUSPECTS } from '../data/suspects'

/**
 * Evidence Chain types
 */
export const CHAIN_TYPES = {
  CONSPIRACY_LINK: 'conspiracy_link',
  FINANCIAL_TRAIL: 'financial_trail',
  WEAPON_MATCH: 'weapon_match',
  ALIBI_BREAKDOWN: 'alibi_breakdown',
  MOTIVE_REVEAL: 'motive_reveal'
}

/**
 * Chain definitions with prerequisites and revelations
 */
export const EVIDENCE_CHAINS = {
  [CHAIN_TYPES.CONSPIRACY_LINK]: {
    name: 'Conspiracy Uncovered',
    description: 'Connect evidence linking multiple suspects',
    stages: [
      { id: 'witness_sighting', trigger: 'witness', description: 'A witness saw two suspects together' },
      { id: 'letter_found', trigger: 'document', description: 'Correspondence between suspects' },
      { id: 'shared_motive', trigger: 'motive', description: 'Both suspects benefit from the crime' }
    ],
    revelation: 'CONSPIRACY CONFIRMED: These suspects worked together!'
  },
  [CHAIN_TYPES.FINANCIAL_TRAIL]: {
    name: 'Follow the Money',
    description: 'Trace financial connections to the crime',
    stages: [
      { id: 'debt_notice', trigger: 'financial', description: 'Evidence of significant debt' },
      { id: 'payment_record', trigger: 'document', description: 'Suspicious payment records' },
      { id: 'beneficiary', trigger: 'motive', description: 'Clear financial benefit from the crime' }
    ],
    revelation: 'FINANCIAL MOTIVE CONFIRMED: Follow the money!'
  },
  [CHAIN_TYPES.WEAPON_MATCH]: {
    name: 'Weapon Analysis',
    description: 'Match physical evidence to the murder weapon',
    stages: [
      { id: 'wound_analysis', trigger: 'crime_scene', description: 'Crime scene wound analysis' },
      { id: 'forensic_match', trigger: 'forensic', description: 'Forensic evidence matches a weapon' },
      { id: 'ownership', trigger: 'testimony', description: 'Suspect had access to the weapon' }
    ],
    revelation: 'WEAPON CONFIRMED: The murder weapon has been identified!'
  },
  [CHAIN_TYPES.ALIBI_BREAKDOWN]: {
    name: 'Alibi Under Scrutiny',
    description: 'Expose holes in a suspect\'s alibi',
    stages: [
      { id: 'initial_alibi', trigger: 'testimony', description: 'Suspect provides alibi' },
      { id: 'contradiction', trigger: 'witness', description: 'Witness contradicts the alibi' },
      { id: 'timeline_gap', trigger: 'timeline', description: 'Gap in timeline during murder' }
    ],
    revelation: 'ALIBI BROKEN: The suspect cannot account for their whereabouts!'
  },
  [CHAIN_TYPES.MOTIVE_REVEAL]: {
    name: 'Hidden Motive',
    description: 'Uncover the true reason behind the murder',
    stages: [
      { id: 'surface_motive', trigger: 'interrogation', description: 'Known disagreement with victim' },
      { id: 'deeper_secret', trigger: 'document', description: 'Hidden documents reveal more' },
      { id: 'desperation', trigger: 'financial', description: 'Desperate circumstances confirmed' }
    ],
    revelation: 'MOTIVE REVEALED: The true reason for the murder is clear!'
  }
}

/**
 * Generates evidence chains for a game based on the solution.
 * @param {Object} solution - The murder solution
 * @returns {Array} Array of evidence chain objects
 */
export function generateEvidenceChains(solution) {
  const chains = []

  // Always include weapon match chain
  chains.push({
    type: CHAIN_TYPES.WEAPON_MATCH,
    ...EVIDENCE_CHAINS[CHAIN_TYPES.WEAPON_MATCH],
    suspect: solution.suspects[0],
    weapon: solution.weapon,
    progress: 0,
    completed: false,
    unlockedRevelation: null
  })

  // Always include alibi breakdown for killer(s)
  solution.suspects.forEach(suspect => {
    chains.push({
      type: CHAIN_TYPES.ALIBI_BREAKDOWN,
      ...EVIDENCE_CHAINS[CHAIN_TYPES.ALIBI_BREAKDOWN],
      suspect,
      progress: 0,
      completed: false,
      unlockedRevelation: null
    })
  })

  // Add conspiracy chain if it's a conspiracy
  if (solution.isConspiracy) {
    chains.push({
      type: CHAIN_TYPES.CONSPIRACY_LINK,
      ...EVIDENCE_CHAINS[CHAIN_TYPES.CONSPIRACY_LINK],
      suspects: solution.suspects,
      progress: 0,
      completed: false,
      unlockedRevelation: null
    })
  }

  // Add motive reveal chain
  chains.push({
    type: CHAIN_TYPES.MOTIVE_REVEAL,
    ...EVIDENCE_CHAINS[CHAIN_TYPES.MOTIVE_REVEAL],
    suspect: solution.suspects[0],
    progress: 0,
    completed: false,
    unlockedRevelation: null
  })

  // Add financial trail if applicable
  if (Math.random() > 0.5) {
    chains.push({
      type: CHAIN_TYPES.FINANCIAL_TRAIL,
      ...EVIDENCE_CHAINS[CHAIN_TYPES.FINANCIAL_TRAIL],
      suspect: solution.suspects[0],
      progress: 0,
      completed: false,
      unlockedRevelation: null
    })
  }

  return chains
}

/**
 * Checks if a clue advances any evidence chains.
 * @param {string} clue - The clue text
 * @param {Array} chains - Current evidence chains
 * @returns {Object} Updated chains and any unlocked revelations
 */
export function checkChainProgress(clue, chains) {
  const updatedChains = [...chains]
  const revelations = []
  const clueLower = clue.toLowerCase()

  // Detect clue type
  const clueTypes = []
  if (clueLower.includes('witness') || clueLower.includes('saw')) clueTypes.push('witness')
  if (clueLower.includes('document') || clueLower.includes('letter') || clueLower.includes('correspondence')) clueTypes.push('document')
  if (clueLower.includes('financial') || clueLower.includes('debt') || clueLower.includes('£')) clueTypes.push('financial')
  if (clueLower.includes('motive') || clueLower.includes('reason') || clueLower.includes('benefit')) clueTypes.push('motive')
  if (clueLower.includes('alibi') || clueLower.includes('claims') || clueLower.includes('story')) clueTypes.push('testimony')
  if (clueLower.includes('body') || clueLower.includes('crime scene') || clueLower.includes('wound')) clueTypes.push('crime_scene')
  if (clueLower.includes('forensic') || clueLower.includes('examined') || clueLower.includes('consistent')) clueTypes.push('forensic')
  if (clueLower.includes('interrogated')) clueTypes.push('interrogation')
  if (clueLower.includes('timeline') || clueLower.includes('time') || clueLower.includes('9:')) clueTypes.push('timeline')

  // Check each chain
  updatedChains.forEach((chain, index) => {
    if (chain.completed) return

    const currentStage = chain.stages[chain.progress]
    if (!currentStage) return

    // Check if clue triggers the current stage
    if (clueTypes.includes(currentStage.trigger)) {
      updatedChains[index] = {
        ...chain,
        progress: chain.progress + 1
      }

      // Check if chain is now complete
      if (updatedChains[index].progress >= chain.stages.length) {
        updatedChains[index].completed = true
        updatedChains[index].unlockedRevelation = chain.revelation
        revelations.push({
          chainName: chain.name,
          revelation: chain.revelation,
          suspect: chain.suspect || (chain.suspects ? chain.suspects.join(' & ') : null)
        })
      }
    }
  })

  return { updatedChains, revelations }
}

/**
 * Gets a summary of chain progress for display.
 * @param {Array} chains - Evidence chains
 * @returns {Object} Summary statistics
 */
export function getChainsSummary(chains) {
  return {
    total: chains.length,
    completed: chains.filter(c => c.completed).length,
    inProgress: chains.filter(c => c.progress > 0 && !c.completed).length,
    notStarted: chains.filter(c => c.progress === 0).length
  }
}
