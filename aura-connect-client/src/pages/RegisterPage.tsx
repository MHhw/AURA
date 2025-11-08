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

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
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
      const { data } = await httpClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', form)
      localStorage.setItem('auth_token', data.data.accessToken)
      setSuccess(`${data.data.user.name}님, 환영합니다! 자동으로 로그인되었으며 토큰이 저장되었습니다.`)
    } catch (submitError) {
      console.error(submitError)
      setError('회원가입에 실패했습니다. 입력 정보를 다시 확인해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page">
      <h1 className="page__title">회원가입</h1>
      <p className="page__description">프로젝트 AURA 대시보드에서 사용할 새 계정을 만들어 주세요.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="register-name">이름</label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={50}
            value={form.name}
            onChange={handleChange}
            placeholder="홍길동"
          />
        </div>

        <div className="form-field">
          <label htmlFor="register-email">이메일</label>
          <input
            id="register-email"
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
          <label htmlFor="register-password">비밀번호</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            placeholder="최소 8자 이상 입력"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
          <span className="form-actions__hint">
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </span>
        </div>

        {success && <p className="form-message form-message--success">{success}</p>}
        {error && <p className="form-message form-message--error">{error}</p>}
      </form>
    </section>
  )
}

export default RegisterPage

