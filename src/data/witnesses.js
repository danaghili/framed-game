// Witness types in the manor
export const WITNESS_CATEGORIES = {
  STAFF: {
    id: 'staff',
    label: 'Household Staff',
    reliability: 'high',
    examples: ['Butler', 'Maid', 'Cook', 'Footman', 'Housekeeper']
  },
  GUEST: {
    id: 'guest',
    label: 'Fellow Guest',
    reliability: 'medium',
    examples: ['Guest', 'Visitor', 'Acquaintance']
  },
  FAMILY: {
    id: 'family',
    label: 'Family Member',
    reliability: 'low',
    examples: ['Relative', 'Spouse', 'Sibling']
  }
}

export const WITNESS_RELIABILITY = {
  HIGH: { label: 'Reliable', color: '#22c55e', weight: 3 },
  MEDIUM: { label: 'Uncertain', color: '#eab308', weight: 2 },
  LOW: { label: 'Questionable', color: '#f97316', weight: 1 }
}

// Statement templates for corroborating testimony
export const CORROBORATING_STATEMENTS = {
  location: [
    'I saw {suspect} in the {location} around {time}.',
    '{suspect} was definitely in the {location} at {time}. I served them refreshments.',
    'I can confirm {suspect} was present in the {location}. We spoke briefly around {time}.',
    '{suspect} was in the {location} when I passed through at {time}.'
  ],
  activity: [
    '{suspect} was engaged in conversation with other guests.',
    'I noticed {suspect} reading quietly.',
    '{suspect} appeared occupied with correspondence.',
    '{suspect} was examining the artwork on the walls.'
  ],
  demeanor: [
    '{suspect} seemed calm and composed.',
    '{suspect} appeared to be in good spirits.',
    'Nothing unusual about {suspect}\'s behavior.',
    '{suspect} was acting perfectly normal.'
  ]
}

// Statement templates for contradicting testimony
export const CONTRADICTING_STATEMENTS = {
  location: [
    'I did NOT see {suspect} in the {location} at {time}, though they claim otherwise.',
    'Strange... I was in the {location} around {time} and {suspect} was not there.',
    '{suspect} says they were in the {location}? I checked there at {time} and it was empty.',
    'The {location} was locked from {time} onwards. {suspect} could not have been there.'
  ],
  activity: [
    '{suspect} seemed agitated and distracted.',
    'I saw {suspect} pacing nervously.',
    '{suspect} was behaving rather strangely.',
    '{suspect} appeared to be hiding something.'
  ],
  demeanor: [
    '{suspect} seemed unusually tense.',
    'There was something off about {suspect}\'s manner.',
    '{suspect} avoided eye contact when we spoke.',
    '{suspect} was sweating despite the cool evening.'
  ],
  sighting: [
    'I saw {suspect} heading toward {location} around the time of the murder.',
    '{suspect} was lurking near {location} that evening.',
    'I noticed {suspect} leaving {location} in a hurry.',
    '{suspect} was spotted near the scene shortly before the incident.'
  ]
}

// Neutral/ambiguous statements
export const NEUTRAL_STATEMENTS = [
  'I didn\'t pay much attention to {suspect} that evening.',
  'I may have seen {suspect}, but I can\'t be certain of the time.',
  '{suspect}? Yes, they were around, but I didn\'t note where specifically.',
  'I was too busy with my duties to notice {suspect}\'s movements.'
]
