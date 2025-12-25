/**
 * Random event definitions for the game
 */

export const EVENT_TYPES = {
  BONUS: 'bonus',           // Helpful to player
  OBSTACLE: 'obstacle',     // Hinders player
  NEUTRAL: 'neutral',       // Provides information
  DRAMATIC: 'dramatic'      // Story/atmosphere
}

export const RANDOM_EVENTS = [
  // Bonus Events (helpful)
  {
    id: 'witness_comes_forward',
    type: EVENT_TYPES.BONUS,
    title: 'A Witness Comes Forward',
    description: 'A nervous servant approaches you with information they were too scared to share before.',
    effect: 'bonus_clue',
    probability: 0.08,
    clueTemplate: 'Servant whispers: "I saw {suspect} leaving {room} looking agitated around the time of the murder."'
  },
  {
    id: 'hidden_compartment',
    type: EVENT_TYPES.BONUS,
    title: 'Hidden Compartment Discovered',
    description: 'You accidentally trigger a hidden compartment in the furniture.',
    effect: 'bonus_clue',
    probability: 0.06,
    clueTemplate: 'Hidden in a secret drawer: A note mentioning {suspect} and a sum of £{amount}.'
  },
  {
    id: 'extra_interrogation',
    type: EVENT_TYPES.BONUS,
    title: 'Suspect Feels Talkative',
    description: 'One of the suspects seems eager to talk - perhaps they want to clear their name.',
    effect: 'extra_interrogation',
    probability: 0.05
  },

  // Obstacle Events (hinder player)
  {
    id: 'power_outage',
    type: EVENT_TYPES.OBSTACLE,
    title: 'Power Outage!',
    description: 'The lights flicker and go out. By the time they return, you\'ve lost precious time.',
    effect: 'lose_turn',
    probability: 0.05
  },
  {
    id: 'evidence_tampered',
    type: EVENT_TYPES.OBSTACLE,
    title: 'Evidence Tampered',
    description: 'Someone has been in the room before you. Some evidence may have been disturbed.',
    effect: 'confusion',
    probability: 0.04,
    clueTemplate: 'WARNING: This room shows signs of tampering. Evidence reliability uncertain.'
  },
  {
    id: 'suspect_uncooperative',
    type: EVENT_TYPES.OBSTACLE,
    title: 'Suspect Clams Up',
    description: 'The suspect you were about to question has suddenly become uncooperative.',
    effect: 'block_interrogation',
    probability: 0.04
  },

  // Neutral Events (information)
  {
    id: 'gossip_overheard',
    type: EVENT_TYPES.NEUTRAL,
    title: 'Gossip Overheard',
    description: 'You overhear servants gossiping in the hallway.',
    effect: 'bonus_clue',
    probability: 0.08,
    clueTemplate: 'Overheard gossip: "Everyone knows {suspect1} and {suspect2} have been at odds over {reason}."'
  },
  {
    id: 'newspaper_clipping',
    type: EVENT_TYPES.NEUTRAL,
    title: 'Old Newspaper Found',
    description: 'An old newspaper clipping falls from behind a painting.',
    effect: 'bonus_clue',
    probability: 0.06,
    clueTemplate: 'Newspaper clipping from 6 months ago mentions {suspect} in connection with a financial scandal.'
  },

  // Dramatic Events (atmosphere)
  {
    id: 'storm_intensifies',
    type: EVENT_TYPES.DRAMATIC,
    title: 'Storm Intensifies',
    description: 'Thunder crashes outside as the storm grows more violent. No one is leaving tonight.',
    effect: 'atmosphere',
    probability: 0.06
  },
  {
    id: 'clock_chimes',
    type: EVENT_TYPES.DRAMATIC,
    title: 'The Clock Strikes',
    description: 'The grandfather clock strikes the hour, reminding everyone that time is running out.',
    effect: 'atmosphere',
    probability: 0.05
  },
  {
    id: 'suspicious_sound',
    type: EVENT_TYPES.DRAMATIC,
    title: 'Suspicious Sound',
    description: 'A crash echoes from somewhere in the manor. When you investigate, nothing seems amiss.',
    effect: 'atmosphere',
    probability: 0.05
  }
]

// Reasons for conflicts (used in gossip events)
export const CONFLICT_REASONS = [
  'money matters',
  'a romantic entanglement',
  'a business deal gone wrong',
  'family inheritance',
  'professional rivalry',
  'a past betrayal'
]
