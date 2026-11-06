import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getStoredUser, setStoredUser, clearAuthTokens, setAuthTokens } from '../lib/api'

interface AuthContextType {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (accessToken: string, refreshToken: string, user: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    const accessToken = localStorage.getItem('queuecare_access_token')
    if (storedUser && accessToken) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = (accessToken: string, refreshToken: string, userData: any) => {
    setAuthTokens(accessToken, refreshToken)
    setStoredUser(userData)
    setUser(userData)
  }

  const logout = () => {
    clearAuthTokens()
    setUser(null)
    window.location.href = '/login'
  }

  const isAuthenticated = !!user && !!localStorage.getItem('queuecare_access_token')

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}