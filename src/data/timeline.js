// Murder time is fixed at 9:15pm
export const MURDER_TIME = '9:15pm'

// Time slots for the evening of the murder
export const TIME_SLOTS = [
  { id: 'early', label: '7:00pm - 8:00pm', start: 19, end: 20 },
  { id: 'dinner', label: '8:00pm - 9:00pm', start: 20, end: 21 },
  { id: 'murder', label: '9:00pm - 9:30pm', start: 21, end: 21.5, isCritical: true },
  { id: 'late', label: '9:30pm - 10:30pm', start: 21.5, end: 22.5 },
  { id: 'night', label: '10:30pm - 11:30pm', start: 22.5, end: 23.5 }
]

export const ALIBI_STRENGTH = {
  CONFIRMED: 'CONFIRMED',
  PARTIAL: 'PARTIAL',
  WEAK: 'WEAK',
  NONE: 'NONE'
}

export const ALIBI_STRENGTH_CONFIG = {
  CONFIRMED: {
    label: 'Confirmed',
    color: '#22c55e',
    description: 'Multiple independent witnesses verify this alibi'
  },
  PARTIAL: {
    label: 'Partial',
    color: '#eab308',
    description: 'Some corroboration but gaps remain'
  },
  WEAK: {
    label: 'Weak',
    color: '#f97316',
    description: 'Self-reported with little verification'
  },
  NONE: {
    label: 'No Alibi',
    color: '#ef4444',
    description: 'Cannot account for whereabouts'
  }
}

// Alibi templates by location/activity
export const ALIBI_TEMPLATES = {
  dining: [
    'Was at dinner in the Dining Room',
    'Seated at the main table for dinner',
    'Attended the dinner service'
  ],
  socializing: [
    'Conversing in the Grand Hall',
    'Engaged in conversation with guests',
    'Mingling at the social gathering'
  ],
  private: [
    'Retired to private quarters',
    'Resting in the bedroom',
    'Taking a personal break'
  ],
  working: [
    'Reviewing documents in the Study',
    'Attending to business matters',
    'Working on correspondence'
  ],
  hobby: [
    'Playing billiards in the Billiard Room',
    'Reading in the Library',
    'Tending plants in the Conservatory'
  ],
  service: [
    'Overseeing household matters',
    'Checking on the kitchen staff',
    'Managing the evening service'
  ]
}

// Witness types for corroboration
export const WITNESS_TYPES = {
  STAFF: 'household staff',
  GUEST: 'another guest',
  MULTIPLE: 'multiple witnesses',
  NONE: 'no one'
}
