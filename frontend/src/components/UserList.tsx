import type { GitHubUser } from '../types/GitHubUser';
import './UserList.css';

interface UserListProps {
  users: GitHubUser[];
  isLoading: boolean;
  onSelectUser: (username: string) => void;
}

export function UserList({ users, isLoading, onSelectUser }: UserListProps) {
  if (isLoading) {
    return <div className="user-list loading">Loading...</div>;
  }

  if (users.length === 0) {
    return <div className="user-list empty">No users found. Click "Load Users" to get started.</div>;
  }

  return (
    <div className="user-list">
      <div className="user-grid">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => onSelectUser(user.login)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelectUser(user.login)}
          >
            <img src={user.avatar_url} alt={user.login} className="user-avatar" />
            <h3 className="user-login">{user.login}</h3>
            <p className="user-id">ID: {user.id}</p>
            <p className="user-type">{user.type}</p>
            {user.site_admin && <span className="admin-badge">Admin</span>}
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="user-link">
              View on GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
