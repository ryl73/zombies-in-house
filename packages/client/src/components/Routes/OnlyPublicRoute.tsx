import { Navigate } from 'react-router-dom'
import { isUserLoggedIn } from '../../slices/userSlice'
import { useSelector } from 'react-redux'

interface ProtectedRouteProps {
  children: ReactNode
}

export const OnlyPublicRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector(isUserLoggedIn)
  if (isLoggedIn) {
    return <Navigate to="/" replace />
  } else {
    return <>{children}</>
  }
}
