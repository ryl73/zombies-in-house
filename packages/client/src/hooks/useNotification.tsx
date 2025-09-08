import { createContext, useContext, useState, ReactNode } from 'react'
import { Snackbar, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface NotificationState {
  message: string
  type: NotificationType
  open: boolean
  duration: number | null
}

interface NotificationContextType {
  showNotification: (
    message: string,
    type?: NotificationType,
    duration?: number | null
  ) => void
  hideNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

interface NotificationProviderProps {
  children: ReactNode
}

const getSnackbarProps = (type: NotificationType): Partial<SnackbarProps> => {
  switch (type) {
    case 'success':
      return {
        ContentProps: {
          style: { backgroundColor: '#4caf50' },
        },
      }
    case 'error':
      return {
        ContentProps: {
          style: { backgroundColor: '#f44336' },
        },
      }
    case 'warning':
      return {
        ContentProps: {
          style: { backgroundColor: '#ff9800' },
        },
      }
    case 'info':
      break
    default:
      break
  }
}

export const NotificationProvider: FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    open: false,
    duration: 6000,
  })

  const showNotification = (
    message: string,
    type: NotificationType = 'info',
    duration: number | null = 6000
  ) => {
    setNotification({
      message,
      type,
      open: true,
      duration,
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }
  const snackbarProps = getSnackbarProps(notification.type)
  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}>
      {children}

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={notification.open}
        autoHideDuration={
          notification.duration === null ? undefined : notification.duration
        }
        onClose={hideNotification}
        message={notification.message}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={hideNotification}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        {...snackbarProps}
      />
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }

  const showSuccess = (message: string, duration?: number | null) => {
    context.showNotification(message, 'success', duration ?? 3000)
  }

  const showError = (message: string, duration?: number | null) => {
    context.showNotification(message, 'error', duration ?? 5000)
  }

  const showWarning = (message: string, duration?: number | null) => {
    context.showNotification(message, 'warning', duration ?? 4000)
  }

  const showInfo = (message: string, duration?: number | null) => {
    context.showNotification(message, 'info', duration ?? 3000)
  }

  return {
    ...context,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification: context.hideNotification,
  }
}
