export const WEAPONS = [
  'Poison', 'Candlestick', 'Revolver', 'Rope', 'Dagger',
  'Letter Opener', 'Fire Poker', 'Syringe', 'Derringer', 'Heavy Statue',
  'Silk Scarf', 'Wine Bottle', 'Scissors', 'Walking Cane', 'Fireplace Tongs'
]

export const WEAPON_DETAILS = {
  'Poison': {
    description: "Rare botanical toxin from Lady Blackwood's collection",
    availability: 'Only found in Conservatory. Requires botanical knowledge.',
    forensics: 'Leaves no trace. Victim died within minutes.',
    suspects: ['Lady Blackwood', 'Dr. Sterling']
  },
  'Candlestick': {
    description: 'Heavy brass candlestick from Dining Room',
    availability: 'Anyone could access it during dinner',
    forensics: 'Would leave head trauma. Body shows no blunt force.',
    suspects: ['Anyone']
  },
  'Revolver': {
    description: "Colonel Ashford's service weapon",
    availability: 'Kept in Study gun cabinet. Key held by Lord Ravencrest.',
    forensics: 'Would be loud. No gunshot heard. Body has no bullet wounds.',
    suspects: ['Colonel Ashford', 'Lord Ravencrest']
  },
  'Rope': {
    description: 'Thick rope from Servant Quarters',
    availability: 'Servants area, but accessible',
    forensics: 'Would leave ligature marks. No marks found on victim.',
    suspects: ['Miss Hartley', 'Anyone']
  },
  'Dagger': {
    description: 'Ornamental dagger from Gallery collection',
    availability: 'On display, easy to grab',
    forensics: 'Would cause bleeding. Victim had no stab wounds.',
    suspects: ['Anyone']
  },
  'Letter Opener': {
    description: 'Silver letter opener from Study desk',
    availability: 'In Study, easily accessible',
    forensics: 'Sharp blade could puncture. No puncture wounds found.',
    suspects: ['Anyone']
  },
  'Fire Poker': {
    description: 'Iron poker from Grand Hall fireplace',
    availability: 'Common item, several throughout manor',
    forensics: 'Could cause blunt trauma or piercing. No matching injuries.',
    suspects: ['Anyone']
  },
  'Syringe': {
    description: "Medical syringe from Dr. Sterling's bag",
    availability: 'Requires medical knowledge',
    forensics: 'Would leave injection mark. No injection sites visible.',
    suspects: ['Dr. Sterling']
  },
  'Derringer': {
    description: 'Small concealed pistol',
    availability: 'Easily hidden, unknown origin',
    forensics: 'Small caliber. Would still be audible. No gunshot reported.',
    suspects: ['Anyone']
  },
  'Heavy Statue': {
    description: 'Marble bust from Gallery',
    availability: 'Heavy, requires strength to wield',
    forensics: 'Would shatter bone. No such trauma evident.',
    suspects: ['Colonel Ashford', 'Lord Ravencrest']
  },
  'Silk Scarf': {
    description: 'Fine silk scarf',
    availability: 'Common accessory',
    forensics: 'Could strangle without leaving obvious marks. No signs of asphyxiation.',
    suspects: ['Lady Blackwood', 'Miss Hartley']
  },
  'Wine Bottle': {
    description: 'Heavy wine bottle from Wine Cellar',
    availability: 'Many throughout the manor',
    forensics: 'Glass would shatter. Would leave cuts. No glass fragments found.',
    suspects: ['Anyone']
  },
  'Scissors': {
    description: 'Large shears from Conservatory',
    availability: 'Gardening area',
    forensics: 'Would create cutting wounds. No cuts observed.',
    suspects: ['Anyone']
  },
  'Walking Cane': {
    description: "Lord Ravencrest's weighted cane",
    availability: "Lord's personal item",
    forensics: 'Metal tip could pierce. Shaft could bludgeon. No matching trauma.',
    suspects: ['Lord Ravencrest']
  },
  'Fireplace Tongs': {
    description: 'Heavy iron tongs from Master Bedroom fireplace',
    availability: 'Found in bedrooms with fireplaces',
    forensics: 'Could grip or strike. No corresponding marks found.',
    suspects: ['Anyone']
  }
}

// Body condition descriptions keyed by weapon
export const BODY_CONDITIONS = {
  'Poison': 'The victim appears to have died from internal complications. Foam residue near mouth, eyes show unusual dilation.',
  'Candlestick': 'Massive head injury visible. The victim was struck from behind with considerable force.',
  'Revolver': 'A bullet wound to the chest. Powder burns suggest close range. Victim died quickly.',
  'Rope': "Deep marks encircle the victim's neck. Clear signs of a violent struggle took place.",
  'Dagger': 'Several penetrating wounds to the upper body. Extensive blood pooling surrounds the body.',
  'Letter Opener': 'A single deep puncture wound to the torso. Thin blade entry point visible.',
  'Fire Poker': 'Severe trauma to the skull. The implement appears to have been swung with force.',
  'Syringe': 'Small puncture mark on the neck. Victim collapsed suddenly. Internal organ failure suspected.',
  'Derringer': 'Small caliber gunshot wound to the head. Entry wound behind the ear.',
  'Heavy Statue': 'Crushed skull. The weapon was extremely heavy and struck with brutal force.',
  'Silk Scarf': 'Faint bruising around the throat. Face shows signs of oxygen deprivation. Silent death.',
  'Wine Bottle': 'Head trauma with lacerations. Fragments of dark glass embedded in the wound.',
  'Scissors': 'Two parallel puncture wounds to the back. Victim was attacked from behind.',
  'Walking Cane': 'Blunt force trauma to the temple. Circular indentation suggests a rounded weapon tip.',
  'Fireplace Tongs': 'Unusual grip marks on the throat. Metal implement caused distinctive bruising pattern.'
}
