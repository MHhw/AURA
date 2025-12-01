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

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [titleInput, setTitleInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="App">
      <h1>메모 목록</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <label>
            제목
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              disabled={submitting}
            />
          </label>
        </div>
        <div>
          <label>
            내용
            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              disabled={submitting}
              rows={3}
            />
          </label>
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? '저장 중...' : '메모 추가'}
        </button>
      </form>

      {loading && <p>불러오는 중...</p>}

      {!loading && error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p>등록된 메모가 없습니다.</p>
      )}

      {!loading && !error && notes.length > 0 && (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <small>
                작성 시간:{' '}
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
