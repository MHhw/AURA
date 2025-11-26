import { Navigate, useLocation } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useSalon } from '../../contexts/SalonContext'

const SalonGuard = ({ children }: { children: ReactNode }) => {
  const { selectedSalon } = useSalon()
  const location = useLocation()

  if (!selectedSalon) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default SalonGuard
