export const SUSPECTS = [
  'Lady Blackwood',
  'Colonel Ashford',
  'Dr. Sterling',
  'Miss Hartley',
  'Lord Ravencrest'
]

export const SUSPECT_PROFILES = {
  'Lady Blackwood': {
    age: 42,
    occupation: 'Wealthy Botanist & Society Hostess',
    background: 'Secretive research into poisonous plants. Dark past in colonial India.',
    motive: 'Victim discovered her illegal botanical experiments',
    alibi: 'Claims she was in the Conservatory tending to rare specimens',
    personality: 'Manipulative, intelligent, botanical expertise',
    relationships: 'Secret affair with Dr. Sterling. Business partner with Lord Ravencrest.',
    location: 'Conservatory',
    motiveStrength: 'STRONG',
    motiveDetails: 'Victim discovered her illegal botanical research and threatened to expose her to the Royal Society, ending her career and social standing.',
    financialStake: 50000,
    physicalTraits: {
      height: 'average',
      build: 'slender',
      hairColor: 'dark',
      shoeSize: 6,
      handedness: 'right'
    }
  },
  'Colonel Ashford': {
    age: 58,
    occupation: 'Retired Military Officer',
    background: 'Decorated war hero with a violent past. Struggling with gambling debts.',
    motive: 'Victim was blackmailing him over wartime crimes',
    alibi: 'Says he was in the Billiard Room playing solo',
    personality: 'Hot-tempered, military discipline, weapons expert',
    relationships: 'Argued publicly with victim. Owes money to Lord Ravencrest.',
    location: 'Billiard Room',
    motiveStrength: 'STRONG',
    motiveDetails: 'Victim was blackmailing him over wartime crimes. Exposure would mean court-martial, imprisonment, and disgrace.',
    financialStake: 25000,
    physicalTraits: {
      height: 'tall',
      build: 'heavy',
      hairColor: 'gray',
      shoeSize: 11,
      handedness: 'right'
    }
  },
  'Dr. Sterling': {
    age: 35,
    occupation: 'Private Physician',
    background: 'Brilliant doctor with questionable ethics. Recently lost medical license.',
    motive: 'Victim knew about illegal prescriptions and patient deaths',
    alibi: 'Claims to be in Study reviewing medical journals',
    personality: 'Smooth, manipulative, medical expertise',
    relationships: 'Secretly meeting Lady Blackwood. Treated Lord Ravencrest.',
    location: 'Study',
    motiveStrength: 'MODERATE',
    motiveDetails: 'Victim knew about illegal prescriptions and patient deaths. Exposure would end his medical career permanently.',
    financialStake: 15000,
    physicalTraits: {
      height: 'average',
      build: 'average',
      hairColor: 'dark',
      shoeSize: 9,
      handedness: 'left'
    }
  },
  'Miss Hartley': {
    age: 28,
    occupation: 'Governess',
    background: 'Educated woman from poor background. Desperately needs her position.',
    motive: 'Victim discovered she was stealing from the household',
    alibi: "Says she was putting children to bed in Children's Bedroom",
    personality: 'Nervous, protective, resourceful',
    relationships: 'Loyal to Lady Blackwood. Afraid of Colonel Ashford.',
    location: 'Master Bedroom',
    motiveStrength: 'WEAK',
    motiveDetails: 'Victim discovered minor household thefts. Risk is dismissal without reference.',
    financialStake: 500,
    physicalTraits: {
      height: 'short',
      build: 'slender',
      hairColor: 'light',
      shoeSize: 7,
      handedness: 'right'
    }
  },
  'Lord Ravencrest': {
    age: 67,
    occupation: 'Manor Owner & Businessman',
    background: 'Old money aristocrat. Business ventures failing. Heavy drinker.',
    motive: 'Victim was his business partner planning to expose financial fraud',
    alibi: 'Claims he was drunk in the Wine Cellar',
    personality: 'Arrogant, desperate, access to everything',
    relationships: 'Employs everyone. Financially controls Colonel Ashford.',
    location: 'Wine Cellar',
    motiveStrength: 'STRONG',
    motiveDetails: 'Victim, his business partner, planned to expose massive financial fraud. Prison and complete ruin awaited.',
    financialStake: 100000,
    physicalTraits: {
      height: 'tall',
      build: 'heavy',
      hairColor: 'gray',
      shoeSize: 10,
      handedness: 'right'
    }
  }
}
