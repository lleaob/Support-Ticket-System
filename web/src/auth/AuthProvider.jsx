import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import { login as apiLogin, register as apiRegister, fetchCurrentUser } from '../lib/api.js'

const TOKEN_KEY = 'supportdesk.token'

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    if (!token) {
      setUser(null)
      setLoading(false)
      return () => {
        cancelled = true
      }
    }

    fetchCurrentUser(token)
      .then((result) => {
        if (!cancelled) {
          setUser(result.user)
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  async function signIn(email, password) {
    const { user: signedInUser, token: newToken } = await apiLogin(email, password)
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(signedInUser)
  }

  async function signUp(email, name, password) {
    const { user: newUser, token: newToken } = await apiRegister(email, name, password)
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setUser(newUser)
  }

  function signOut() {
    // No server call: the token is a stateless signed claim with no revocation
    // mechanism, so it remains valid until it naturally expires. This only
    // makes the browser forget it.
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = { user, token, loading, signIn, signUp, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
