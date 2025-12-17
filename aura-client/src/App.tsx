import { useMemo } from 'react';
import './App.css';
import { useRouteMode, Mode } from './hooks/useRouteMode';

// 분리한 컴포넌트들 불러오기
import LoginForm, { SocialProvider } from './components/features/auth/LoginForm';
import RegisterPanel from './components/features/auth/RegisterPanel';
import RecoveryPanel from './components/features/auth/RecoveryPanel';

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
          {/* ... 왼쪽 소개 문구는 그대로 ... */}
          <p className="eyebrow">AURA ACCESS</p>
          <h1>당신만의 공간을<br />더 선명하게 열어보세요</h1>
          {/* ... */}
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

// AuthPanel은 작으니까 여기에 둬도 되고, 따로 빼도 돼. 일단 여기 둘게.
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
    <div className="stack" role="tabpanel">
      {/* 탭 버튼들 */}
      <div className="tab-row">
        <button
          className={mode === 'login' ? 'tab active' : 'tab'}
          onClick={() => onNavigate('login')}
        >
          로그인
        </button>
        <button
          className={mode === 'register' ? 'tab active' : 'tab'}
          onClick={() => onNavigate('register')}
        >
          회원가입
        </button>
      </div>

      {/* 조건부 렌더링 */}
      {mode === 'login' && (
        <LoginForm
          socialProviders={socialProviders}
          recoveryProviders={recoveryProviders}
          onNavigateRecover={() => onNavigate('recover')}
        />
      )}
      {mode === 'register' && (
        <RegisterPanel
          socialProviders={socialProviders}
          onNavigateLogin={() => onNavigate('login')}
        />
      )}
      {mode === 'recover' && (
        <RecoveryPanel onNavigateLogin={() => onNavigate('login')} />
      )}
    </div>
  );
}