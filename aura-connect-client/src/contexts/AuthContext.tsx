import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import httpClient from '../lib/httpClient'
import type { ApiResponse } from '../types/api'
import type { AuthUser } from '../types/auth'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback((nextUser: AuthUser) => {
    // Token strings live in HttpOnly cookies; store only normalized user info in memory.
    setUser(nextUser)
  }, [])

  // Re-fetches the authenticated user so that a simple refresh restores the session using cookies.
  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await httpClient.get<ApiResponse<AuthUser>>('/api/v1/auth/me')
      setUser(data.data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const logout = useCallback(async () => {
    try {
      await httpClient.post<ApiResponse<null>>('/api/v1/auth/logout')
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}


