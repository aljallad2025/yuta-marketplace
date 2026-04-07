import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'

/**
 * Wraps a route and redirects to login if not authenticated with the correct role.
 * role: 'admin' | 'vendor' | 'driver'
 * loginPath: where to redirect if not authenticated
 */
export default function ProtectedRoute({ children, role, loginPath }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to={loginPath} replace />
  }

  if (role && currentUser.role !== role) {
    // Redirect to their own portal if logged in with wrong role
    const redirects = { admin: '/admin', vendor: '/vendor', driver: '/driver' }
    return <Navigate to={redirects[currentUser.role] || '/'} replace />
  }

  return children
}
