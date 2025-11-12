import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * 수동 점검 방법:
 * 1. 백엔드 서버와 프론트엔드를 모두 실행한다.
 * 2. 로그인 페이지에서 원하는 소셜 로그인 버튼(예: "구글로 로그인")을 클릭한다.
 * 3. 백엔드 인증이 성공하면 브라우저 주소 표시줄이 `/oauth2/callback?token=...` 형태로 변경되는지 확인한다.
 * 4. 이 페이지가 자동으로 대시보드로 이동하면서 localStorage에 토큰이 저장되는지 개발자 도구(Application 탭)에서 확인한다.
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  const token = useMemo(() => searchParams.get('token'), [searchParams])

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token)
      navigate('/', { replace: true })
    } else {
      setError('인증 토큰이 전달되지 않았습니다. 다시 시도해 주세요.')
    }
  }, [navigate, token])

  return (
    <section className="page">
      <h1 className="page__title">소셜 로그인 처리 중...</h1>
      <p className="page__description">
        백엔드에서 전달된 인증 토큰을 처리하고 있습니다. 잠시만 기다려 주세요.
      </p>
      {error && <p className="form-message form-message--error">{error}</p>}
    </section>
  )
}

export default OAuthCallbackPage
