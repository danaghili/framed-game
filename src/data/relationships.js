export const RELATIONSHIP_TYPES = {
  secret_lovers: {
    strength: 'STRONG',
    conspiracy_compatible: true,
    description: 'Secret romantic relationship',
    color: '#ff69b4'
  },
  business_partners: {
    strength: 'STRONG',
    conspiracy_compatible: true,
    description: 'Business partnership',
    color: '#4169e1'
  },
  married: {
    strength: 'STRONG',
    conspiracy_compatible: true,
    description: 'Married couple',
    color: '#ff1493'
  },
  blackmail: {
    strength: 'MODERATE',
    conspiracy_compatible: true,
    description: 'Blackmail relationship',
    color: '#8b0000'
  },
  family: {
    strength: 'MODERATE',
    conspiracy_compatible: false,
    description: 'Family relation',
    color: '#32cd32'
  },
  employer_employee: {
    strength: 'WEAK',
    conspiracy_compatible: false,
    description: 'Employer-employee',
    color: '#808080'
  },
  rivals: {
    strength: 'WEAK',
    conspiracy_compatible: false,
    description: 'Rivals/enemies',
    color: '#ff4500'
  },
  acquaintances: {
    strength: 'WEAK',
    conspiracy_compatible: false,
    description: 'Casual acquaintances',
    color: '#d3d3d3'
  }
}

// Note: Relationships are now generated dynamically by relationshipGenerator.js
// Each game has a unique relationship network for increased replayability.
