import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '../data/constants'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth < BREAKPOINTS.MOBILE
      : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.MOBILE) {
        setBreakpoint('mobile')
      } else if (width < BREAKPOINTS.DESKTOP) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}
