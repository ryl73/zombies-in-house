import { useState, useEffect, useCallback } from 'react'

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSupported =
    typeof document !== 'undefined' &&
    ('fullscreenEnabled' in document ||
      'webkitFullscreenEnabled' in document ||
      'mozFullScreenEnabled' in document ||
      'msFullscreenEnabled' in document)

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any
      const fullscreenElement =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement

      setIsFullscreen(!!fullscreenElement)
    }

    const doc = document as any
    doc.addEventListener('fullscreenchange', handleFullscreenChange)
    doc.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    doc.addEventListener('mozfullscreenchange', handleFullscreenChange)
    doc.addEventListener('MSFullscreenChange', handleFullscreenChange)
    handleFullscreenChange()

    return () => {
      doc.removeEventListener('fullscreenchange', handleFullscreenChange)
      doc.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      doc.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      doc.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = useCallback(
    async (element?: HTMLElement) => {
      if (!isSupported) {
        setError('Полноэкранный режим не поддерживается')
        return
      }
      const targetElement = element || document.documentElement
      const el = targetElement as any
      try {
        setError(null)
        if (el.requestFullscreen) {
          await el.requestFullscreen()
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen()
        } else if (el.mozRequestFullScreen) {
          await el.mozRequestFullScreen()
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen()
        }
      } catch (err) {
        const errorMessage =
          (err as string) || 'Ошибка перехода в полноэкранный режим'
        setError(errorMessage)
        console.error('Ошибка:', err)
      }
    },
    [isSupported]
  )

  const exitFullscreen = useCallback(async () => {
    try {
      setError(null)
      const doc = document as any
      if (doc.exitFullscreen) {
        await doc.exitFullscreen()
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen()
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen()
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen()
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to exit fullscreen'
      setError(errorMessage)
      console.error('Fullscreen error:', err)
    }
  }, [])

  const toggleFullscreen = useCallback(
    async (element?: HTMLElement) => {
      if (isFullscreen) {
        await exitFullscreen()
      } else {
        await enterFullscreen(element)
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen]
  )

  return {
    isFullscreen,
    isSupported,
    error,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  }
}
