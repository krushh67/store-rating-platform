import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleBadge = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">⭐ StoreRating</Link>
      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">{user.name?.split(' ')[0]}</span>
            <span className={`badge ${roleBadge[user.role]}`}>{user.role.replace('_', ' ')}</span>
            <Link to="/change-password" className="btn btn-outline btn-sm">Change Password</Link>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
