import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type AuthenticatedUser = {
  id: number
  email: string
  name: string
  profileImageUrl: string | null
  socialType: string
}

export type AuthPayload = {
  accessToken: string
  user: AuthenticatedUser
}

type AuthContextValue = {
  user: AuthenticatedUser | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (payload: AuthPayload) => void
  logout: () => void
}

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const parseStoredUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY)
    return storedUser ? (JSON.parse(storedUser) as AuthenticatedUser) : null
  } catch (error) {
    console.warn('Failed to parse stored auth user', error)
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => parseStoredUser())
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : localStorage.getItem(AUTH_TOKEN_KEY),
  )

  const login = useCallback((payload: AuthPayload) => {
    setUser(payload.user)
    setAccessToken(payload.accessToken)
    localStorage.setItem(AUTH_TOKEN_KEY, payload.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(payload.user))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
    }),
    [user, accessToken, login, logout],
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

