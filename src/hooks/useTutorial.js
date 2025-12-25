import { useState, useCallback } from 'react'

const STORAGE_KEYS = {
  COMPLETED: 'framed-tour-completed',
  STEP: 'framed-tour-step'
}

// Initialize state from localStorage
const getInitialTourState = () => {
  const savedStep = localStorage.getItem(STORAGE_KEYS.STEP)
  const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true'

  if (savedStep && !completed) {
    return {
      isTourActive: true,
      currentStep: parseInt(savedStep, 10)
    }
  }
  return { isTourActive: false, currentStep: 0 }
}

export function useTutorial() {
  const initialState = getInitialTourState()
  const [isTourActive, setIsTourActive] = useState(initialState.isTourActive)
  const [currentStep, setCurrentStep] = useState(initialState.currentStep)
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  // Check if user has completed tour before
  const hasCompletedTour = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.COMPLETED) === 'true'
  }, [])

  // Skip/complete tour
  const completeTour = useCallback(() => {
    setIsTourActive(false)
    setCurrentStep(0)
    localStorage.setItem(STORAGE_KEYS.COMPLETED, 'true')
    localStorage.removeItem(STORAGE_KEYS.STEP)
  }, [])

  // Start the tour
  const startTour = useCallback((fromStep = 0) => {
    setCurrentStep(fromStep)
    setIsTourActive(true)
    setShowHowToPlay(false)
    localStorage.setItem(STORAGE_KEYS.STEP, fromStep.toString())
  }, [])

  // Go to next step
  const nextStep = useCallback((totalSteps) => {
    const next = currentStep + 1
    if (next >= totalSteps) {
      completeTour()
    } else {
      setCurrentStep(next)
      localStorage.setItem(STORAGE_KEYS.STEP, next.toString())
    }
  }, [currentStep, completeTour])

  // Go to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      localStorage.setItem(STORAGE_KEYS.STEP, prev.toString())
    }
  }, [currentStep])

  // Reset tour (for testing or replay)
  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED)
    localStorage.removeItem(STORAGE_KEYS.STEP)
  }, [])

  // Open How to Play modal
  const openHowToPlay = useCallback(() => {
    setShowHowToPlay(true)
  }, [])

  // Close How to Play modal
  const closeHowToPlay = useCallback(() => {
    setShowHowToPlay(false)
  }, [])

  return {
    // State
    isTourActive,
    currentStep,
    showHowToPlay,

    // Queries
    hasCompletedTour,

    // Actions
    startTour,
    nextStep,
    prevStep,
    completeTour,
    resetTour,
    openHowToPlay,
    closeHowToPlay
  }
}
