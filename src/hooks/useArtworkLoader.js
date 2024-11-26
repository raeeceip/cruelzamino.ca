import { useState, useEffect } from 'react'

export function useArtworkLoader(artworks) {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const imagesToLoad = artworks.length
    let loadedCount = 0

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(src)
        img.onerror = reject
      })
    }

    Promise.all(
      artworks.map(artwork =>
        preloadImage(artwork.image)
          .then(src => {
            if (mounted) {
              loadedCount++
              setLoadedImages(prev => new Set([...prev, src]))
              if (loadedCount === imagesToLoad) {
                setIsLoading(false)
              }
            }
          })
          .catch(error => console.error('Error loading image:', error))
      )
    )

    return () => {
      mounted = false
    }
  }, [artworks])

  return {
    isLoading,
    loadedImages: Array.from(loadedImages),
    progress: loadedImages.size / artworks.length
  }
}