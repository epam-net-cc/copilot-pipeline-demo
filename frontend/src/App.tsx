import { useState, useEffect } from 'react';
import { UserList } from './components/UserList';
import { UserDetail } from './components/UserDetail';
import { Pagination } from './components/Pagination';
import type { GitHubUser } from './types/GitHubUser';
import { githubUsersApi } from './services/githubUsersApi';
import './App.css';

function App() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [since, setSince] = useState(0);
  const [perPage, setPerPage] = useState(30);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const fetchUsers = async (startId: number, count: number) => {
    setIsLoading(true);
    setError(null);
    
    const result = await githubUsersApi.listUsers({
      since: startId,
      perPage: count,
    });

    if (result.error) {
      setError(result.error);
      setUsers([]);
    } else {
      setUsers(result.users);
      setSince(startId);
      setPerPage(count);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Fetch initial data on mount
    fetchUsers(0, 30);
  }, []);

  const handleNextPage = () => {
    if (users.length > 0) {
      const lastUserId = users[users.length - 1].id;
      fetchUsers(lastUserId, perPage);
    }
  };

  const handlePreviousPage = () => {
    if (since > 0) {
      const newSince = Math.max(0, since - perPage);
      fetchUsers(newSince, perPage);
    }
  };

  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1>🐙 GitHub Users Explorer</h1>
          <p>Browse GitHub users with cursor-based pagination</p>
        </header>

        <main className="app-main">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <section className="results-section">
            {selectedUsername ? (
              <UserDetail
                username={selectedUsername}
                onBack={() => setSelectedUsername(null)}
              />
            ) : (
              <>
                <Pagination
                  currentSince={since}
                  perPage={perPage}
                  onPerPageChange={(value) => setPerPage(value)}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  isLoading={isLoading}
                  hasData={users.length > 0}
                />
                <UserList users={users} isLoading={isLoading} onSelectUser={setSelectedUsername} />
              </>
            )}
          </section>

          <div className="action-buttons">
            <button
              className="btn-load"
              onClick={() => fetchUsers(since, perPage)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Users'}
            </button>
          </div>
        </main>

        <footer className="app-footer">
          <p>Powered by <a href="https://docs.github.com/en/rest">GitHub REST API</a></p>
          <p><small>Rate limit: 60 requests/hour (unauthenticated)</small></p>
        </footer>
      </div>
    </>
  );
}

export default App;
