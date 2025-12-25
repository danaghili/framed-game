import { Map, FileText, Target, Users, Clock, BookOpen, Crosshair } from 'lucide-react'

// Tour step definitions
// Each step can target an element by data-tour attribute or be a general overlay

export const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome, Detective!',
    content: "A murder has occurred at Blackwood Manor. You must find the killer, the weapon, and the crime scene before your rival detective solves it first.",
    target: null, // No specific element - centered overlay
    icon: null,
    position: 'center'
  },
  {
    id: 'map',
    title: 'Search the Manor',
    content: "Click on rooms to search for evidence. Each search costs 1 turn. Look for clues that point to suspects, weapons, or locations.",
    target: '[data-tour="floorplan"]',
    icon: Map,
    position: 'right'
  },
  {
    id: 'evidence',
    title: 'Evidence Panel',
    content: "Evidence you discover appears here. Read carefully - some clues point to the killer, others are red herrings!",
    target: '[data-tour="evidence-panel"]',
    icon: FileText,
    position: 'left',
    desktopOnly: true
  },
  {
    id: 'deduction',
    title: 'Deduction Board',
    content: "Track your investigation here. Mark suspects, weapons, and rooms as 'Suspected', 'Ruled Out', or 'Maybe' as you gather evidence.",
    target: '[data-tour="deduction-board"]',
    icon: Target,
    position: 'right',
    desktopOnly: true
  },
  {
    id: 'interrogate',
    title: 'Interrogate Suspects',
    content: "Click 'Ask' next to any suspect to interrogate them. This reveals their timeline and may expose their relationships with others.",
    target: '[data-tour="suspects-tab"]',
    icon: Users,
    position: 'right'
  },
  {
    id: 'turns',
    title: 'Race Against Time',
    content: "You have limited turns! Your rival detective is also investigating. If you run out of turns, the police close the case unsolved.",
    target: '[data-tour="turns-counter"]',
    icon: Clock,
    position: 'bottom'
  },
  {
    id: 'resources',
    title: 'Investigation Tools',
    content: "Access Dossiers for suspect backgrounds, Relationships for connections, Witnesses for testimony, and Timeline for alibis.",
    target: '[data-tour="action-buttons"]',
    icon: BookOpen,
    position: 'bottom'
  },
  {
    id: 'accusation',
    title: 'Make Your Accusation',
    content: "When you're confident, click 'Make Accusation'. Choose the killer(s), murder weapon, and crime scene. You only get ONE chance - be sure!",
    target: '[data-tour="accuse-button"]',
    icon: Crosshair,
    position: 'bottom'
  }
]

// Mobile-specific adjustments
export const getMobileSteps = () => {
  return TOUR_STEPS.filter(step => !step.desktopOnly).map(step => ({
    ...step,
    // Adjust positions for mobile
    position: step.position === 'left' || step.position === 'right' ? 'bottom' : step.position
  }))
}

export const getStepsForDevice = (isMobile) => {
  return isMobile ? getMobileSteps() : TOUR_STEPS
}
