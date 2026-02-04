'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_PREFIX = 'mls2vegas_counter_'

interface UsePersistentAnimatedCounterOptions {
  duration?: number
  onIncrement?: () => void
}

export function usePersistentAnimatedCounter(
  key: string,
  targetValue: number,
  options: UsePersistentAnimatedCounterOptions = {}
) {
  const { duration = 800, onIncrement } = options
  
  const [displayedValue, setDisplayedValue] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const initializedRef = useRef(false)
  const lastTargetRef = useRef<number>(targetValue)

  // Initialize from localStorage or target value
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const storageKey = `${STORAGE_PREFIX}${key}`
    const storedValue = localStorage.getItem(storageKey)
    
    if (storedValue !== null) {
      const parsed = parseInt(storedValue, 10)
      if (!isNaN(parsed)) {
        // If stored value exists, use it as starting point
        // Never go below stored value
        const startValue = Math.max(parsed, targetValue)
        setDisplayedValue(startValue)
        localStorage.setItem(storageKey, String(startValue))
        
        // If target is higher than stored, animate
        if (targetValue > parsed) {
          animateToValue(parsed, targetValue)
        }
        return
      }
    }
    
    // No stored value - show target immediately without animation
    setDisplayedValue(targetValue)
    localStorage.setItem(storageKey, String(targetValue))
  }, []) // Only run once on mount

  // Handle target value changes after initial load
  useEffect(() => {
    if (!initializedRef.current || displayedValue === null) return
    if (targetValue === lastTargetRef.current) return
    
    lastTargetRef.current = targetValue
    
    // Clamp: never decrease
    const nextTarget = Math.max(displayedValue, targetValue)
    
    if (nextTarget > displayedValue) {
      animateToValue(displayedValue, nextTarget)
    }
  }, [targetValue, displayedValue])

  const animateToValue = useCallback((from: number, to: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const storageKey = `${STORAGE_PREFIX}${key}`
    setIsAnimating(true)
    onIncrement?.()

    const startTime = performance.now()
    const diff = to - from

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.round(from + diff * easedProgress)

      setDisplayedValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayedValue(to)
        localStorage.setItem(storageKey, String(to))
        setIsAnimating(false)
        animationRef.current = null
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [key, duration, onIncrement])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Increment function for live ticks
  const increment = useCallback((amount: number = 1) => {
    if (displayedValue === null) return
    
    const newValue = displayedValue + amount
    const storageKey = `${STORAGE_PREFIX}${key}`
    
    animateToValue(displayedValue, newValue)
    localStorage.setItem(storageKey, String(newValue))
  }, [displayedValue, key, animateToValue])

  return {
    value: displayedValue ?? targetValue,
    isAnimating,
    increment,
  }
}
