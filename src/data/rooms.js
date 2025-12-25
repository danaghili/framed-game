export const ROOMS = [
  'Grand Hall', 'Library', 'Dining Room', 'Billiard Room',
  'Conservatory', 'Study', 'Kitchen', 'Wine Cellar',
  'Master Bedroom', 'Gallery', 'Ballroom', 'Servant Quarters'
]

// Room layout metadata for FloorplanMap
export const ROOM_LAYOUT = {
  groundFloor: ['Grand Hall', 'Library', 'Dining Room', 'Billiard Room', 'Conservatory', 'Kitchen'],
  firstFloor: ['Study', 'Master Bedroom', 'Gallery', 'Ballroom'],
  basement: ['Wine Cellar'],
  attic: ['Servant Quarters']
}

// Room positions for map rendering (percentages)
export const ROOM_POSITIONS = {
  'Library': { floor: 'ground', top: '8%', left: '5%', width: '28%', height: '35%' },
  'Grand Hall': { floor: 'ground', top: '30%', left: '37%', width: '26%', height: '40%' },
  'Dining Room': { floor: 'ground', top: '8%', right: '5%', width: '30%', height: '35%' },
  'Billiard Room': { floor: 'ground', bottom: '8%', left: '5%', width: '25%', height: '30%' },
  'Kitchen': { floor: 'ground', bottom: '8%', left: '32%', width: '20%', height: '30%' },
  'Conservatory': { floor: 'ground', bottom: '8%', right: '5%', width: '28%', height: '30%' },
  'Master Bedroom': { floor: 'first', top: '10%', left: '5%', width: '22%', height: '35%' },
  'Study': { floor: 'first', bottom: '10%', left: '5%', width: '22%', height: '35%' },
  'Gallery': { floor: 'first', top: '10%', left: '35%', width: '25%', height: '80%' },
  'Ballroom': { floor: 'first', top: '10%', right: '5%', width: '30%', height: '80%' },
  'Wine Cellar': { floor: 'basement' },
  'Servant Quarters': { floor: 'attic' }
}
