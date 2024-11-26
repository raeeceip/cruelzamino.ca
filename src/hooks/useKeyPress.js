import { useEffect } from 'react'

export function useKeyPress(key, callback) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === key) {
        callback()
      }
    }
    
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
