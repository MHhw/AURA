import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import httpClient from '../lib/httpClient'

type AuthenticatedUser = {
  id: number
  email: string
  name: string
  profileImageUrl: string | null
  socialType: string
}

type AuthResponse = {
  accessToken: string
  user: AuthenticatedUser
}

type ApiResponse<T> = {
  code: string
  message: string
  data: T
}

const LoginPage = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const { data } = await httpClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', form)
      localStorage.setItem('auth_token', data.data.accessToken)
      setSuccess(`환영합니다, ${data.data.user.name}님! 액세스 토큰이 저장되었습니다.`)
    } catch (submitError) {
      console.error(submitError)
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsSubmitting(false)
    }
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

        {success && <p className="form-message form-message--success">{success}</p>}
        {error && <p className="form-message form-message--error">{error}</p>}
      </form>
    </section>
  )
}

export default LoginPage

