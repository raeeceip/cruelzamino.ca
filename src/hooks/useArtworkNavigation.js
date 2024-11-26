import { useState, useCallback } from 'react'

export function useArtworkNavigation(artworks) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextArtwork = useCallback(() => {
    setCurrentIndex((prev) => 
      prev < artworks.length - 1 ? prev + 1 : prev
    )
  }, [artworks.length])

  const previousArtwork = useCallback(() => {
    setCurrentIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    )
  }, [])

  const goToArtwork = useCallback((index) => {
    if (index >= 0 && index < artworks.length) {
      setCurrentIndex(index)
    }
  }, [artworks.length])

  return {
    currentArtwork: artworks[currentIndex],
    currentIndex,
    nextArtwork,
    previousArtwork,
    goToArtwork,
    hasNext: currentIndex < artworks.length - 1,
    hasPrevious: currentIndex > 0
  }
}

// src/hooks/useIntersectionObserver.js
import { useState, useEffect, useRef } from 'react'

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current)
      }
    }
  }, [options])

  return [targetRef, isIntersecting]
}