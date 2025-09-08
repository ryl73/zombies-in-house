import { Navigate } from 'react-router-dom'
import { isUserLoggedIn } from '../../slices/userSlice'
import { useSelector } from 'react-redux'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector(isUserLoggedIn)
  if (isLoggedIn) {
    return <>{children}</>
  } else {
    return <Navigate to="/signin" replace />
  }
}
