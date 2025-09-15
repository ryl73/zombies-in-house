import { useState, useCallback } from 'react'

export const useBrowserNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && window.Notification
      ? window.Notification.permission
      : 'default'
  )

  const isSupported = typeof window !== 'undefined' && 'Notification' in window

  const requestPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!isSupported) {
        return 'denied'
      }
      try {
        const currentPermission = Notification.permission
        if (currentPermission !== 'granted') {
          const result = await Notification.requestPermission()
          setPermission(result)
          return result
        }
        setPermission(currentPermission)
        return currentPermission
      } catch (error) {
        console.error('Ошибка: ', error)
        return 'denied'
      }
    }, [isSupported])

  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions): Promise<boolean> => {
      if (!isSupported) return false
      let currentPermission = Notification.permission
      setPermission(currentPermission)
      if (currentPermission === 'default') {
        currentPermission = await requestPermission()
      }
      if (currentPermission !== 'granted') {
        return false
      }
      try {
        new Notification(title, options)
        return true
      } catch (error) {
        console.error('Ошибка отображения уведомления:', error)
        return false
      }
    },
    [isSupported, requestPermission]
  )

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
  }
}
