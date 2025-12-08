import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import './App.css';

type Mode = 'login' | 'register';
type RegisterStep = 'verify' | 'details';

type SocialProvider = {
  name: string;
  accent: string;
  label: string;
};

function App() {
  const [mode, setMode] = useState<Mode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('verify');

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
                setRegisterStep('verify');
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
            <RegisterPanel
              onNavigateLogin={() => setMode('login')}
              step={registerStep}
              onChangeStep={setRegisterStep}
            />
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
  step,
  onChangeStep,
}: {
  onNavigateLogin: () => void;
  step: RegisterStep;
  onChangeStep: (step: RegisterStep) => void;
}) {
  return (
    <div className="stack" role="tabpanel" aria-labelledby="회원가입">
      <div className="panel-header">
        <div>
          <p className="eyebrow">회원가입 여정</p>
          <p className="header__title">원하는 인증 방식으로 시작하고, 바로 계정 정보를 입력하세요.</p>
        </div>
        <div className="header__actions">
          <button type="button" className="secondary-btn" onClick={() => onChangeStep('details')}>
            상세 입력 화면 미리보기
          </button>
          <button type="button" className="ghost-link" onClick={onNavigateLogin}>
            이미 계정이 있으신가요? 로그인
          </button>
        </div>
      </div>

      {step === 'verify' ? (
        <div className="stack gap-sm">
          <div className="banner">
            <p className="banner__eyebrow">간편 인증</p>
            <strong>휴대폰 또는 이메일로 빠르게 본인 확인 후 회원가입을 진행하세요.</strong>
            <p className="banner__desc">아이핀 없이도 보안이 유지되는 두 가지 인증 방식을 제공합니다.</p>
          </div>

          <div className="verification-grid">
            <VerificationCard
              title="휴대폰 본인인증"
              description="본인 명의 휴대폰으로 인증번호를 받아 확인합니다."
              accent="phone"
              onNext={() => onChangeStep('details')}
            />
            <VerificationCard
              title="이메일 본인인증"
              description="이메일로 전달된 코드를 입력해 신원을 확인합니다."
              accent="mail"
              onNext={() => onChangeStep('details')}
            />
          </div>

          <ul className="note-list">
            <li>만 14세 미만은 보호자 동의가 필요합니다.</li>
            <li>인증이 어려울 경우 고객센터로 문의하거나 다른 인증 수단을 선택해주세요.</li>
          </ul>
        </div>
      ) : (
        <div className="stack gap-sm" aria-live="polite">
          <div className="detail-header">
            <p className="badge">STEP 2</p>
            <div>
              <p className="detail-title">계정 정보 입력</p>
              <p className="detail-desc">인증 후 전달될 핵심 정보만 먼저 준비했습니다.</p>
            </div>
            <button type="button" className="text-link" onClick={() => onChangeStep('verify')}>
              인증 단계로 돌아가기
            </button>
          </div>

          <form className="form" onSubmit={(event) => event.preventDefault()}>
            <label className="field">
              <span className="field__label">아이디</span>
              <input type="text" placeholder="영문 또는 이메일" autoComplete="username" />
            </label>
            <label className="field">
              <span className="field__label">비밀번호</span>
              <input type="password" placeholder="8자 이상, 영문/숫자 조합" autoComplete="new-password" />
            </label>
            <label className="field">
              <span className="field__label">비밀번호 확인</span>
              <input type="password" placeholder="비밀번호를 한 번 더 입력" autoComplete="new-password" />
            </label>
            <div className="placeholder-rows" aria-hidden>
              <div className="placeholder" />
              <div className="placeholder" />
            </div>
            <button type="submit" className="primary-btn">
              가입 정보 임시 저장
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function VerificationCard({
  title,
  description,
  accent,
  onNext,
}: {
  title: string;
  description: string;
  accent: 'phone' | 'mail';
  onNext: () => void;
}) {
  return (
    <article className={`verification-card ${accent}`}>
      <div className="card-icon" aria-hidden>
        {accent === 'phone' ? '📱' : '✉️'}
      </div>
      <div className="card-body">
        <p className="card-title">{title}</p>
        <p className="card-desc">{description}</p>
        <button type="button" className="primary-btn" onClick={onNext}>
          인증 진행하기
        </button>
      </div>
    </article>
  );
}

export default App;
