import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import httpClient from './lib/httpClient';
import './App.css';

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

type AuthUser = {
  id: number;
  email: string;
  displayName: string;
  provider: 'LOCAL' | 'GOOGLE' | 'NAVER' | 'KAKAO';
};

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setAuthLoading(true);
        const response = await httpClient.get<AuthUser>('/api/auth/me');
        setAuthUser(response.data);
      } catch (err) {
        setAuthUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (!authUser) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await httpClient.get<Note[]>('/api/notes');
        setNotes(response.data);
      } catch (err) {
        console.error(err);
        setError('메모 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [authUser]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = titleInput.trim();
    const trimmedContent = contentInput.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await httpClient.post<Note>('/api/notes', {
        title: trimmedTitle,
        content: trimmedContent,
      });

      setNotes((prev) => [response.data, ...prev]);
      setTitleInput('');
      setContentInput('');
    } catch (err) {
      console.error(err);
      alert('메모 저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setAuthError(null);
      const response = await httpClient.post<AuthUser>('/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      setAuthUser(response.data);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else {
        setAuthError('로그인에 실패했습니다.');
      }
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setAuthError(null);
      const response = await httpClient.post<AuthUser>('/api/auth/register', {
        email: registerEmail,
        password: registerPassword,
        displayName: registerName,
      });
      setAuthUser(response.data);
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterName('');
      setMode('login');
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setAuthError(err.response.data.message);
      } else {
        setAuthError('회원가입에 실패했습니다.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await httpClient.post('/api/auth/logout');
    } finally {
      setAuthUser(null);
      setNotes([]);
    }
  };

  if (authLoading) {
    return (
      <div className="App">
        <div className="panel">
          <p>세션을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="App auth">
        <div className="panel">
          <h1 className="title">AURA</h1>
          <p className="subtitle">메모 앱을 이용하려면 로그인 또는 회원가입을 진행하세요.</p>

          <div className="tab-buttons">
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              로그인
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              회원가입
            </button>
          </div>

          {authError && <p className="error-text">{authError}</p>}

          {mode === 'login' ? (
            <form className="form" onSubmit={handleLogin}>
              <label>
                이메일
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                비밀번호
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit">로그인</button>
            </form>
          ) : (
            <form className="form" onSubmit={handleRegister}>
              <label>
                이메일
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                이름
                <input
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </label>
              <label>
                비밀번호 (8자 이상)
                <input
                  type="password"
                  minLength={8}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit">회원가입</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <div>
          <h1>메모 목록</h1>
          <p className="subtitle">{authUser.displayName}님, 환영합니다.</p>
        </div>
        <div className="header-actions">
          <span className="badge">{authUser.provider}</span>
          <button className="link" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          제목
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            disabled={submitting}
            required
          />
        </label>
        <label>
          내용
          <textarea
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            disabled={submitting}
            rows={3}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? '저장 중...' : '메모 추가'}
        </button>
      </form>

      {loading && <p className="info-text">불러오는 중...</p>}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p className="info-text">등록된 메모가 없습니다.</p>
      )}

      {!loading && !error && notes.length > 0 && (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              <div className="note-header">
                <h2>{note.title}</h2>
                <small>{new Date(note.createdAt).toLocaleString()}</small>
              </div>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
