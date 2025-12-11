import type { CSSProperties, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { login, register } from './lib/authApi';

type Mode = 'login' | 'register' | 'recover';

type SocialProvider = {
  name: string;
  accent: string;
  label: string;
};

type FormError = {
  identifier?: string;
  password?: string;
  email?: string;
  displayName?: string;
  confirmPassword?: string;
};

function resolveMode(pathname: string): Mode {
  if (pathname.includes('register')) return 'register';
  if (pathname.includes('recover')) return 'recover';
  return 'login';
}

function modeToPath(mode: Mode) {
  if (mode === 'register') return '/register';
  if (mode === 'recover') return '/recover';
  return '/login';
}

function useRouteMode(): [Mode, (mode: Mode) => void] {
  const [mode, setMode] = useState<Mode>(() => resolveMode(window.location.pathname));

  useEffect(() => {
    const handler = () => setMode(resolveMode(window.location.pathname));
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (nextMode: Mode) => {
    const path = modeToPath(nextMode);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setMode(nextMode);
  };

  useEffect(() => {
    const path = modeToPath(mode);
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path);
    }
  }, [mode]);

  return [mode, navigate];
}

export default function App() {
  const [mode, navigate] = useRouteMode();

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
            깔끔한 화면에서 로그인하거나 새 계정을 만들고, 원하는 방법으로 쉽게 인증하세요. 불필요한 절차 없이 필요한 정보만
            담아두었습니다.
          </p>
          <div className="pill-list">
            <span className="pill">간편 로그인</span>
            <span className="pill">보안 강화</span>
            <span className="pill">다중 인증 지원</span>
          </div>
        </section>

        <section className="panel" aria-label="인증 패널">
          <AuthPanel
            mode={mode}
            onNavigate={navigate}
            socialProviders={socialProviders}
            recoveryProviders={recoveryProviders}
          />
        </section>
      </main>
    </div>
  );
}

function AuthPanel({
  mode,
  onNavigate,
  socialProviders,
  recoveryProviders,
}: {
  mode: Mode;
  onNavigate: (mode: Mode) => void;
  socialProviders: SocialProvider[];
  recoveryProviders: SocialProvider[];
}) {
  return (
    <div className="stack" role="tabpanel" aria-labelledby="인증">
      <div className="tab-row" role="tablist" aria-label="로그인/회원가입 전환">
        <button
          type="button"
          role="tab"
          className={mode === 'login' ? 'tab active' : 'tab'}
          aria-selected={mode === 'login'}
          onClick={() => onNavigate('login')}
        >
          로그인
        </button>
        <button
          type="button"
          role="tab"
          className={mode === 'register' ? 'tab active' : 'tab'}
          aria-selected={mode === 'register'}
          onClick={() => onNavigate('register')}
        >
          회원가입
        </button>
      </div>

      {mode === 'login' && (
        <LoginForm
          socialProviders={socialProviders}
          recoveryProviders={recoveryProviders}
          onNavigateRecover={() => onNavigate('recover')}
        />
      )}
      {mode === 'register' && <RegisterPanel socialProviders={socialProviders} onNavigateLogin={() => onNavigate('login')} />}
      {mode === 'recover' && <RecoveryPanel onNavigateLogin={() => onNavigate('login')} />}
    </div>
  );
}

function LoginForm({
  socialProviders,
  recoveryProviders,
  onNavigateRecover,
}: {
  socialProviders: SocialProvider[];
  recoveryProviders: SocialProvider[];
  onNavigateRecover: () => void;
}) {
  const [form, setForm] = useState({ identifier: '', password: '', remember: false });
  const [errors, setErrors] = useState<FormError>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const nextErrors: FormError = {};

    if (!form.identifier.trim()) {
      nextErrors.identifier = '아이디 또는 이메일을 입력하세요.';
    }

    if (!form.password.trim()) {
      nextErrors.password = '비밀번호를 입력하세요.';
    } else if (form.password.length < 8) {
      nextErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await login({ email: form.identifier, password: form.password });
      setStatus(response.message ?? '로그인에 성공했습니다.');
    } catch (error) {
      setStatus('로그인에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stack" role="tabpanel" aria-labelledby="로그인">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="field__label">아이디</span>
          <input
            type="text"
            placeholder="이메일 또는 아이디"
            value={form.identifier}
            onChange={(event) => setForm((prev) => ({ ...prev, identifier: event.target.value }))}
            aria-invalid={Boolean(errors.identifier)}
          />
          {errors.identifier && <span className="field__error">{errors.identifier}</span>}
        </label>
        <label className="field">
          <span className="field__label">비밀번호</span>
          <input
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <span className="field__error">{errors.password}</span>}
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(event) => setForm((prev) => ({ ...prev, remember: event.target.checked }))}
          />
          <span>아이디 저장</span>
        </label>

        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? '확인 중...' : '로그인'}
        </button>
      </form>

      {status && <p className="status">{status}</p>}

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
            onClick={onNavigateRecover}
          >
            <span className="dot" aria-hidden />
            {provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RegisterPanel({
  socialProviders,
  onNavigateLogin,
}: {
  socialProviders: SocialProvider[];
  onNavigateLogin: () => void;
}) {
  const [form, setForm] = useState({ email: '', displayName: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FormError>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const nextErrors: FormError = {};

    if (!form.email.trim()) {
      nextErrors.email = '이메일을 입력하세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = '올바른 이메일 형식을 입력하세요.';
    }

    if (!form.displayName.trim()) {
      nextErrors.displayName = '이름 또는 닉네임을 입력하세요.';
    }

    if (!form.password.trim()) {
      nextErrors.password = '비밀번호를 입력하세요.';
    } else if (form.password.length < 8) {
      nextErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await register({ email: form.email, password: form.password, displayName: form.displayName });
      setStatus(response.message ?? '회원가입이 완료되었습니다.');
      setTimeout(() => onNavigateLogin(), 1200);
    } catch (error) {
      setStatus('회원가입에 실패했습니다. 이미 사용 중인 이메일인지 확인하세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stack" role="tabpanel" aria-labelledby="회원가입">
      <div className="panel-header">
        <div>
          <p className="eyebrow">간편 회원가입</p>
          <p className="header__title">카카오, 네이버, 구글 계정으로 바로 시작하세요.</p>
        </div>
        <div className="header__actions">
          <button type="button" className="ghost-link" onClick={onNavigateLogin}>
            로그인하러 가기
          </button>
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

      <form className="form" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span className="field__label">이메일</span>
          <input
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>
        <label className="field">
          <span className="field__label">이름 / 닉네임</span>
          <input
            type="text"
            placeholder="이름 또는 닉네임"
            value={form.displayName}
            onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
            aria-invalid={Boolean(errors.displayName)}
          />
          {errors.displayName && <span className="field__error">{errors.displayName}</span>}
        </label>
        <label className="field">
          <span className="field__label">비밀번호</span>
          <input
            type="password"
            placeholder="8자 이상 입력하세요"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <span className="field__error">{errors.password}</span>}
        </label>
        <label className="field">
          <span className="field__label">비밀번호 확인</span>
          <input
            type="password"
            placeholder="비밀번호를 한번 더 입력"
            value={form.confirmPassword}
            onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword && <span className="field__error">{errors.confirmPassword}</span>}
        </label>
        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '가입 중...' : '회원가입 완료'}
        </button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
}

function RecoveryPanel({ onNavigateLogin }: { onNavigateLogin: () => void }) {
  return (
    <div className="stack" role="tabpanel" aria-labelledby="계정 복구">
      <div className="panel-header">
        <div>
          <p className="eyebrow">도움이 필요하신가요?</p>
          <p className="header__title">등록된 이메일 주소로 계정 복구 안내를 보내드립니다.</p>
        </div>
      </div>
      <p className="intro__desc">
        로그인 페이지 하단의 링크를 통해 복구 페이지로 이동했습니다. 계정 복구는 실제 이메일 인증 연동을 준비 중이며, 현재는
        등록된 고객센터로 문의하시면 빠르게 도와드릴 수 있습니다.
      </p>
      <div className="pill-list">
        <span className="pill">이메일 확인</span>
        <span className="pill">휴대폰 인증(준비 중)</span>
        <span className="pill">고객센터 연동</span>
      </div>
      <button type="button" className="ghost-link" onClick={onNavigateLogin}>
        로그인으로 돌아가기
      </button>
    </div>
  );
}
