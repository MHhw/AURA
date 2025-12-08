import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import './App.css';

type Mode = 'login' | 'register';

type QuickLink = {
  label: string;
  href?: string;
};

type SocialProvider = {
  name: string;
  accent: string;
  label: string;
};

function App() {
  const [mode, setMode] = useState<Mode>('login');

  const authLinks: QuickLink[] = useMemo(
    () => [
      { label: '회원가입' },
      { label: '아이디 찾기' },
      { label: '비밀번호 찾기' },
    ],
    [],
  );

  const socialProviders: SocialProvider[] = useMemo(
    () => [
      { name: 'kakao', accent: '#f8d900', label: '카카오로 계속하기' },
      { name: 'naver', accent: '#00bf18', label: '네이버로 계속하기' },
      { name: 'google', accent: '#ffffff', label: 'Google로 계속하기' },
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
              onClick={() => setMode('login')}
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
            <LoginForm authLinks={authLinks} socialProviders={socialProviders} />
          ) : (
            <RegisterPanel
              onNavigateLogin={() => setMode('login')}
              socialProviders={socialProviders}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function LoginForm({
  authLinks,
  socialProviders,
}: {
  authLinks: QuickLink[];
  socialProviders: SocialProvider[];
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

        <div className="form__row">
          <label className="checkbox">
            <input type="checkbox" />
            <span>아이디 저장</span>
          </label>
          <div className="link-list" aria-label="계정 도움말">
            {authLinks.map((link) => (
              <a key={link.label} href={link.href || '#'}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <button type="submit" className="primary-btn">
          로그인
        </button>
      </form>

      <div className="stack gap-sm">
        <div className="divider" role="separator" aria-hidden>
          <span>다른 방법으로 로그인</span>
        </div>
        <div className="social-grid">
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
        <button type="button" className="ghost-link">
          비회원 주문조회
        </button>
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
      <div className="banner">
        <p className="banner__eyebrow">웰컴 혜택</p>
        <strong>가입 시 최대 25,000P와 무료배송 쿠폰을 받아보세요.</strong>
        <p className="banner__desc">기업·단체를 위한 별도 전용 채널도 준비되어 있습니다.</p>
      </div>

      <div className="stack gap-sm">
        <button type="button" className="primary-btn">
          회원가입 시작하기
        </button>
        <div className="inline-actions">
          <button type="button" className="secondary-btn">
            법인회원 가입
          </button>
          <button type="button" className="ghost-link" onClick={onNavigateLogin}>
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>

      <div className="stack gap-sm">
        <div className="divider" role="separator" aria-hidden>
          <span>간편 회원가입</span>
        </div>
        <div className="social-grid">
          {socialProviders.map((provider) => (
            <button
              key={provider.name}
              type="button"
              className={`social-btn social-${provider.name}`}
              style={{ '--accent': provider.accent } as CSSProperties}
            >
              <span className="dot" aria-hidden />
              {provider.label.replace('로그인', '회원가입')}
            </button>
          ))}
        </div>
        <div className="other-methods">
          <p>다른 방법으로 회원가입</p>
          <div className="icon-row" aria-hidden>
            <span className="icon">G</span>
            <span className="icon">휴</span>
            <span className="icon">E</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
