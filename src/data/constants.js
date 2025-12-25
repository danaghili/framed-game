// Responsive breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,    // < 768px = mobile
  TABLET: 1024,   // 768-1023px = tablet
  DESKTOP: 1024   // >= 1024px = desktop
}

// Touch target sizes (accessibility)
export const TOUCH_TARGETS = {
  MINIMUM: 44,    // px - absolute minimum
  RECOMMENDED: 48, // px - preferred
  SPACING: 8      // px - minimum between targets
}

// Game configuration (defaults for NORMAL difficulty)
export const MAX_TURNS = 15
export const MAX_INTERROGATIONS = 3
export const MAX_FORENSICS_USES = 5
export const CONSPIRACY_CHANCE = 0.3
export const MURDER_TIME = '9:15pm'

// Difficulty levels
export const DIFFICULTY = {
  EASY: 'EASY',
  NORMAL: 'NORMAL',
  HARD: 'HARD'
}

// Difficulty configuration
export const DIFFICULTY_CONFIG = {
  [DIFFICULTY.EASY]: {
    label: 'Easy',
    description: 'More time, more resources, fewer conspiracies',
    turns: 20,
    interrogations: 5,
    forensicsUses: 7,
    conspiracyChance: 0.15,
    color: '#22c55e'
  },
  [DIFFICULTY.NORMAL]: {
    label: 'Normal',
    description: 'Balanced challenge for most detectives',
    turns: 15,
    interrogations: 3,
    forensicsUses: 5,
    conspiracyChance: 0.30,
    color: '#eab308'
  },
  [DIFFICULTY.HARD]: {
    label: 'Hard',
    description: 'Limited resources, more conspiracies, higher stakes',
    turns: 12,
    interrogations: 2,
    forensicsUses: 3,
    conspiracyChance: 0.50,
    color: '#ef4444'
  }
}

// Game phases
export const GAME_PHASE = {
  START: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver'
}

// Action types for reducer
export const GAME_ACTIONS = {
  START_GAME: 'START_GAME',
  SEARCH_ROOM: 'SEARCH_ROOM',
  INTERROGATE: 'INTERROGATE',
  EXAMINE_WEAPON: 'EXAMINE_WEAPON',
  BLOCK_ROOM: 'BLOCK_ROOM',
  MAKE_ACCUSATION: 'MAKE_ACCUSATION',
  END_TURN: 'END_TURN',
  OPPONENT_MOVE: 'OPPONENT_MOVE'
}

// Evidence categories
export const EVIDENCE_CATEGORY = {
  CRIME_SCENE: 'crime scene',
  MOTIVE: 'motive',
  WEAPON: 'weapon',
  TESTIMONY: 'testimony',
  CONSPIRACY: 'conspiracy',
  OPPORTUNITY: 'opportunity',
  RED_HERRING: 'red herring',
  ITEM: 'item',
  NEUTRAL: 'neutral'
}

// Alibi strength levels
export const ALIBI_STRENGTH = {
  STRONG: 'STRONG',
  MODERATE: 'MODERATE',
  WEAK: 'WEAK'
}

// Motive strength levels
export const MOTIVE_STRENGTH = {
  STRONG: 'STRONG',
  MODERATE: 'MODERATE',
  WEAK: 'WEAK'
}

// Motive strength display configuration
export const MOTIVE_STRENGTH_CONFIG = {
  STRONG: {
    label: 'STRONG',
    color: '#DC2626',
    bars: 3,
    description: 'Compelling reason to kill'
  },
  MODERATE: {
    label: 'MODERATE',
    color: '#D97706',
    bars: 2,
    description: 'Significant but not desperate'
  },
  WEAK: {
    label: 'WEAK',
    color: '#6B7280',
    bars: 1,
    description: 'Minor grievance'
  }
}
