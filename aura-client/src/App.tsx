import { useEffect, useState } from 'react';
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

  return (
    <div className="App">
      <h1>메모 목록</h1>

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
