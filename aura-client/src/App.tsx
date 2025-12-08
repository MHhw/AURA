import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import './App.css';

type Mode = 'login' | 'register';

type SocialProvider = {
  name: string;
  accent: string;
  label: string;
};

function App() {
  const [mode, setMode] = useState<Mode>('login');

  const socialProviders: SocialProvider[] = useMemo(
    () => [
      { name: 'kakao', accent: '#fee500', label: '카카오' },
      { name: 'naver', accent: '#03c75a', label: '네이버' },
      { name: 'google', accent: '#ffffff', label: '구글' },
    ],
    [],
  );

  const recoveryProviders: SocialProvider[] = useMemo(
    () => [
      { name: 'recover-id', accent: '#7c3aed', label: '아이디 찾기' },
      { name: 'recover-password', accent: '#38bdf8', label: '비밀번호 찾기' },
    ],
    [],
  );

  return (
    <div className="page">
      <div className="page__background" aria-hidden />
      <main className="auth-shell">
        <section className="intro">
          <p className="eyebrow">AURA ACCESS</p>
          <h1>
            당신만의 공간을
            <br />
            더 선명하게 열어보세요
          </h1>
          <p className="intro__desc">
            깔끔한 화면에서 로그인하거나 새 계정을 만들고, 원하는 방법으로 쉽게 인증하세요.
            불필요한 절차 없이 필요한 정보만 담아두었습니다.
          </p>
          <div className="pill-list">
            <span className="pill">간편 로그인</span>
            <span className="pill">보안 강화</span>
            <span className="pill">다중 인증 지원</span>
          </div>
        </section>

        <section className="panel" aria-label="인증 패널">
          <div className="tab-row" role="tablist" aria-label="로그인/회원가입 전환">
            <button
              type="button"
              role="tab"
              className={mode === 'login' ? 'tab active' : 'tab'}
              aria-selected={mode === 'login'}
              onClick={() => {
                setMode('login');
              }}
            >
              로그인
            </button>
            <button
              type="button"
              role="tab"
              className={mode === 'register' ? 'tab active' : 'tab'}
              aria-selected={mode === 'register'}
              onClick={() => setMode('register')}
            >
              회원가입
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm socialProviders={socialProviders} recoveryProviders={recoveryProviders} />
          ) : (
            <RegisterPanel onNavigateLogin={() => setMode('login')} socialProviders={socialProviders} />
          )}
        </section>
      </main>
    </div>
  );
}

function LoginForm({
  socialProviders,
  recoveryProviders,
}: {
  socialProviders: SocialProvider[];
  recoveryProviders: SocialProvider[];
}) {
  return (
    <div className="stack" role="tabpanel" aria-labelledby="로그인">
      <form className="form" onSubmit={(event) => event.preventDefault()}>
        <label className="field">
          <span className="field__label">아이디</span>
          <input type="text" placeholder="이메일 또는 아이디" />
        </label>
        <label className="field">
          <span className="field__label">비밀번호</span>
          <input type="password" placeholder="비밀번호" autoComplete="current-password" />
        </label>

        <label className="checkbox">
          <input type="checkbox" />
          <span>아이디 저장</span>
        </label>

        <button type="submit" className="primary-btn">
          로그인
        </button>
      </form>

      <div className="stack gap-sm">
        <div className="divider" role="separator" aria-hidden>
          <span>다른 방법으로 로그인</span>
        </div>
        <div className="social-row">
          {socialProviders.map((provider) => (
            <button
              key={provider.name}
              type="button"
              className={`social-btn social-${provider.name}`}
              style={{ '--accent': provider.accent } as CSSProperties}
            >
              <span className="dot" aria-hidden />
              {provider.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stack gap-sm">
        <div className="divider" role="separator" aria-hidden>
          <span>계정을 잊어버리셨나요?</span>
        </div>
        <div className="social-row">
          {recoveryProviders.map((provider) => (
            <button
              key={provider.name}
              type="button"
              className={`social-btn social-${provider.name}`}
              style={{ '--accent': provider.accent } as CSSProperties}
            >
              <span className="dot" aria-hidden />
              {provider.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RegisterPanel({
  onNavigateLogin,
  socialProviders,
}: {
  onNavigateLogin: () => void;
  socialProviders: SocialProvider[];
}) {
  return (
    <div className="stack" role="tabpanel" aria-labelledby="회원가입">
      <div className="panel-header">
        <div>
          <p className="eyebrow">간편 회원가입</p>
          <p className="header__title">카카오, 네이버, 구글 계정으로 바로 시작하세요.</p>
        </div>
      </div>

      <div className="stack gap-sm">
        <div className="social-row stretch">
          {socialProviders.map((provider) => (
            <button
              key={provider.name}
              type="button"
              className={`social-btn social-${provider.name}`}
              style={{ '--accent': provider.accent } as CSSProperties}
            >
              <span className="dot" aria-hidden />
              {provider.label}로 시작하기
            </button>
          ))}
        </div>
        <p className="signup-hint">간편 회원가입으로 빠르게 서비스를 이용해 보세요.</p>
      </div>

      <div className="divider" role="separator" aria-hidden>
        <span>이미 계정이 있으신가요?</span>
      </div>
      <button type="button" className="ghost-link full-width" onClick={onNavigateLogin}>
        로그인하러 가기
      </button>
    </div>
  );
}

export default App;
