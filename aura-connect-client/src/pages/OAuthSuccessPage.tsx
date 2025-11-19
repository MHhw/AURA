import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from '../lib/httpClient'
import { useAuth } from '../contexts/AuthContext'
import type { ApiResponse } from '../types/api'
import type { AuthUser } from '../types/auth'

/**
 * Handles the final step of the OAuth2 login flow.
 *
 * 1. The backend stores JWTs inside HttpOnly cookies and redirects to /oauth/success.
 * 2. This page queries /api/v1/auth/me to hydrate the AuthContext with the logged-in user.
 * 3. Users are redirected back to the dashboard without exposing any token strings to JS.
 */
const OAuthSuccessPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const finalizeLogin = async () => {
      try {
        const { data } = await httpClient.get<ApiResponse<AuthUser>>('/api/v1/auth/me')
        if (!isMounted) {
          return
        }
        login(data.data)
        navigate('/', { replace: true })
      } catch {
        if (!isMounted) {
          return
        }
        setError('소셜 로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    }

    finalizeLogin()

    return () => {
      isMounted = false
    }
  }, [login, navigate])

  return (
    <section className="page">
      <h1 className="page__title">소셜 로그인 처리 중...</h1>
      <p className="page__description">
        안전한 쿠키 기반 인증을 마무리하는 중입니다. 잠시만 기다려 주세요.
      </p>
      {error && <p className="form-message form-message--error">{error}</p>}
    </section>
  )
}

export default OAuthSuccessPage
