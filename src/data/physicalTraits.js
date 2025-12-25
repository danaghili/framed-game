export const TRAIT_CATEGORIES = {
  height: {
    label: 'Height',
    values: ['short', 'average', 'tall'],
    evidenceTemplates: [
      'The killer must be {value} based on the blood spatter pattern.',
      'Witness glimpsed a {value} figure fleeing the scene.',
      'The angle of the wound suggests a {value} attacker.'
    ]
  },
  build: {
    label: 'Build',
    values: ['slender', 'average', 'heavy'],
    evidenceTemplates: [
      'Heavy footprints in the carpet suggest a {value} build.',
      'The strength required indicates a {value} person.',
      'A button torn from clothing suggests {value} build.'
    ]
  },
  hairColor: {
    label: 'Hair',
    values: ['dark', 'light', 'gray', 'bald'],
    evidenceTemplates: [
      "A {value} hair strand found on the victim's clothing.",
      'Witness saw someone with {value} hair near the scene.',
      'A {value} hair caught on the window latch.'
    ]
  },
  shoeSize: {
    label: 'Shoe Size',
    values: [6, 7, 8, 9, 10, 11, 12],
    evidenceTemplates: [
      'A muddy footprint outside the window - size {value}.',
      'Distinct shoe impression in the carpet - size {value} boot.',
      'Partial print near the body - approximately size {value}.'
    ]
  },
  handedness: {
    label: 'Handedness',
    values: ['left', 'right'],
    evidenceTemplates: [
      'The wound angle suggests a {value}-handed attacker.',
      'Grip marks indicate the killer is {value}-handed.',
      'The weapon was wielded by someone {value}-handed.'
    ]
  }
}
