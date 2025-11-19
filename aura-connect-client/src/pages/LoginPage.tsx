import type { ChangeEvent, FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import httpClient from '../lib/httpClient'
import { useAuth } from '../contexts/AuthContext'
import type { ApiResponse } from '../types/api'
import type { AuthResponse } from '../types/auth'

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const socialProviders = useMemo(
    () => [
      { label: '구글로 로그인', provider: 'google' },
      { label: '카카오로 로그인', provider: 'kakao' },
      { label: '네이버로 로그인', provider: 'naver' },
    ],
    [],
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { data } = await httpClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', form)
      // Tokens are stored in HttpOnly cookies by the server, so the client only tracks the user object.
      login(data.data.user)
      navigate('/')
    } catch (submitError) {
      console.error(submitError)
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    const backendBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
    // The backend will redirect back to APP_FRONTEND_BASE_URL (see AppProperties) after it stores cookies.
    window.location.href = `${backendBaseUrl}/oauth2/authorization/${provider}`
  }

  return (
    <section className="page">
      <h1 className="page__title">로그인</h1>
      <p className="page__description">발급받은 계정 정보로 AURA Connect 대시보드에 접속해 주세요.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
          <span className="form-actions__hint">
            아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
          </span>
        </div>

        {error && <p className="form-message form-message--error">{error}</p>}
      </form>

      <div className="form-card" aria-label="소셜 로그인 옵션">
        <h2 className="form-card__title">간편 로그인</h2>
        <p className="form-card__description">선호하는 소셜 계정으로 빠르게 로그인하세요.</p>
        <div className="form-actions form-actions--vertical">
          {socialProviders.map(({ label, provider }) => (
            <button
              key={provider}
              type="button"
              onClick={() => handleSocialLogin(provider)}
              className="button button--secondary"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LoginPage

