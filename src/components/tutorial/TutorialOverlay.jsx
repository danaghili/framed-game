import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getStepsForDevice } from './tourSteps'
import { useIsMobile } from '../../hooks/useIsMobile'

const TutorialOverlay = ({ currentStep, onNext, onPrev, onSkip }) => {
  const isMobile = useIsMobile()
  const steps = getStepsForDevice(isMobile)
  const step = steps[currentStep]
  const [targetRect, setTargetRect] = useState(null)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  // Track target element position
  const target = step?.target

  useEffect(() => {
    const updateRect = () => {
      if (!target) {
        setTargetRect(null)
        return
      }

      const element = document.querySelector(target)
      if (element) {
        const rect = element.getBoundingClientRect()
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
      } else {
        setTargetRect(null)
      }
    }

    // Use requestAnimationFrame to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(updateRect)

    // Update on resize/scroll
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [target])

  if (!step) return null

  const Icon = step.icon

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!targetRect || step.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }
    }

    const padding = 16
    const tooltipWidth = isMobile ? 300 : 360

    switch (step.position) {
      case 'right':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left + targetRect.width + padding,
          transform: 'translateY(-50%)',
          maxWidth: tooltipWidth
        }
      case 'left':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + padding,
          transform: 'translateY(-50%)',
          maxWidth: tooltipWidth
        }
      case 'bottom':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
          maxWidth: tooltipWidth
        }
      case 'top':
        return {
          position: 'fixed',
          bottom: window.innerHeight - targetRect.top + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
          maxWidth: tooltipWidth
        }
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
    }
  }

  // Generate clip path for spotlight effect
  const getSpotlightStyle = () => {
    if (!targetRect) {
      return {}
    }

    const padding = 8
    const x = targetRect.left - padding
    const y = targetRect.top - padding
    const w = targetRect.width + padding * 2
    const h = targetRect.height + padding * 2
    const r = 8 // border radius

    // Create a clip path that shows everything except the target area
    return {
      clipPath: `polygon(
        0% 0%,
        0% 100%,
        ${x}px 100%,
        ${x}px ${y + r}px,
        ${x + r}px ${y}px,
        ${x + w - r}px ${y}px,
        ${x + w}px ${y + r}px,
        ${x + w}px ${y + h - r}px,
        ${x + w - r}px ${y + h}px,
        ${x + r}px ${y + h}px,
        ${x}px ${y + h - r}px,
        ${x}px 100%,
        100% 100%,
        100% 0%
      )`
    }
  }

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Dark overlay with spotlight cutout */}
      <div
        className="absolute inset-0 bg-black/80 transition-all duration-300"
        style={targetRect ? getSpotlightStyle() : {}}
        onClick={onSkip}
      />

      {/* Highlight border around target */}
      {targetRect && (
        <div
          className="absolute border-2 border-amber-400 rounded-lg pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="bg-gray-900 border-2 border-amber-500 rounded-xl shadow-2xl p-5 z-[61]"
        style={getTooltipStyle()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
            )}
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-white p-1"
            title="Skip tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {step.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep ? 'bg-amber-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={() => onNext(steps.length)}
              className="flex items-center gap-1 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-lg transition-colors"
            >
              {isLastStep ? "Let's Play!" : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
