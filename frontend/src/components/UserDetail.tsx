import { useState, useEffect } from 'react';
import type { GitHubUser } from '../types/GitHubUser';
import { githubUsersApi } from '../services/githubUsersApi';
import './UserDetail.css';

interface UserDetailProps {
  username: string;
  onBack: () => void;
}

export function UserDetail({ username, onBack }: UserDetailProps) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      const result = await githubUsersApi.getUser(username);
      if (result.error) {
        setError(result.error);
      } else {
        setUser(result.user);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [username]);

  if (isLoading) {
    return <div className="user-detail-loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="user-detail-error">
        <button className="back-button" onClick={onBack}>← Back</button>
        <div className="error-message"><strong>Error:</strong> {error}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-detail">
      <button className="back-button" onClick={onBack}>← Back to list</button>

      <div className="user-detail-card">
        <div className="user-detail-header">
          <img src={user.avatar_url} alt={user.login} className="user-detail-avatar" />
          <div className="user-detail-identity">
            <h2 className="user-detail-name">{user.name || user.login}</h2>
            <p className="user-detail-login">@{user.login}</p>
            {user.site_admin && <span className="admin-badge">Site Admin</span>}
          </div>
        </div>

        {user.bio && <p className="user-detail-bio">{user.bio}</p>}

        <div className="user-detail-stats">
          <div className="stat">
            <span className="stat-value">{user.public_repos}</span>
            <span className="stat-label">Repos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.following}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>

        <dl className="user-detail-info">
          {user.company && (
            <>
              <dt>Company</dt>
              <dd>{user.company}</dd>
            </>
          )}
          {user.location && (
            <>
              <dt>Location</dt>
              <dd>{user.location}</dd>
            </>
          )}
          {user.blog && (
            <>
              <dt>Website</dt>
              <dd>
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.blog}
                </a>
              </dd>
            </>
          )}
          {user.created_at && (
            <>
              <dt>Member since</dt>
              <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
            </>
          )}
          <dt>Type</dt>
          <dd>{user.type}</dd>
        </dl>

        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="github-link">
          View on GitHub →
        </a>
      </div>
    </div>
  );
}
