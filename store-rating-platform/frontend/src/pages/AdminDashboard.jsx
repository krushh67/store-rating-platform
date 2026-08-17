import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ROLES = ['', 'ADMIN', 'USER', 'STORE_OWNER'];

function SortIcon({ field, sortBy, order }) {
  if (sortBy !== field) return <span style={{ color: '#cbd5e1' }}>↕</span>;
  return <span>{order === 'asc' ? '↑' : '↓'}</span>;
}

function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    try {
      await api.post('/admin/users', form);
      onSuccess();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create user'); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">Add New User</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Name (20-60 chars)</label><input className="form-input" value={form.name} onChange={f('name')} required /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={f('email')} required /></div>
          <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={f('address')} required /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={f('password')} required /></div>
          <div className="form-group"><label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={f('role')}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="STORE_OWNER">STORE_OWNER</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={loading}>Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddStoreModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [error, setError] = useState('');
  const f = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || undefined });
      onSuccess();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create store'); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">Add New Store</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Store Name (20-60 chars)</label><input className="form-input" value={form.name} onChange={f('name')} required /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={f('email')} required /></div>
          <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={f('address')} required /></div>
          <div className="form-group"><label className="form-label">Owner ID (optional)</label><input className="form-input" type="number" value={form.ownerId} onChange={f('ownerId')} placeholder="User ID of STORE_OWNER" /></div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary">Create Store</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [tab, setTab] = useState('users');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const loadUsers = useCallback(() => {
    const params = { ...filters, ...sort };
    api.get('/admin/users', { params }).then(r => setUsers(r.data.data)).catch(() => {});
  }, [filters, sort]);

  const loadStores = useCallback(() => {
    const params = { name: filters.name, email: filters.email, address: filters.address, ...sort };
    api.get('/admin/stores', { params }).then(r => setStores(r.data.data)).catch(() => {});
  }, [filters, sort]);

  useEffect(() => { if (tab === 'users') loadUsers(); else loadStores(); }, [tab, loadUsers, loadStores]);

  const handleSort = field => setSort(s => ({ sortBy: field, order: s.sortBy === field && s.order === 'asc' ? 'desc' : 'asc' }));

  const roleBadge = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };

  return (
    <div className="page">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
            <div className="stat-card"><h3>{stats.totalStores}</h3><p>Total Stores</p></div>
            <div className="stat-card"><h3>{stats.totalRatings}</h3><p>Total Ratings</p></div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          {['users', 'stores'].map(t => (
            <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab(t)}>
              {t === 'users' ? 'Users' : 'Stores'}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddUser(true)}>+ Add User</button>
            <button className="btn btn-outline btn-sm" onClick={() => setShowAddStore(true)}>+ Add Store</button>
          </div>
        </div>

        <div className="filters">
          <div className="form-group search-input" style={{ marginBottom: 0 }}>
            <input className="form-input" placeholder="Search by name..." value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input className="form-input" placeholder="Search by email..." value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input className="form-input" placeholder="Search by address..." value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
          </div>
          {tab === 'users' && (
            <select className="form-select" style={{ width: 'auto' }} value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r || 'All Roles'}</option>)}
            </select>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            {tab === 'users' ? (
              <table>
                <thead>
                  <tr>
                    {['name','email','address','role'].map(f => (
                      <th key={f} onClick={() => handleSort(f)}>
                        {f.toUpperCase()} <SortIcon field={f} sortBy={sort.sortBy} order={sort.order} />
                      </th>
                    ))}
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="5" className="empty">No users found</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.address}</td>
                      <td><span className={`badge ${roleBadge[u.role]}`}>{u.role}</span></td>
                      <td><button className="btn btn-outline btn-sm" onClick={async () => {
                        const r = await api.get(`/admin/users/${u.id}`);
                        setSelectedUser(r.data.data);
                      }}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    {['name','email','address'].map(f => (
                      <th key={f} onClick={() => handleSort(f)}>
                        {f.toUpperCase()} <SortIcon field={f} sortBy={sort.sortBy} order={sort.order} />
                      </th>
                    ))}
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.length === 0 ? (
                    <tr><td colSpan="4" className="empty">No stores found</td></tr>
                  ) : stores.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.address}</td>
                      <td>{s.averageRating ? <span className="stars">{'⭐'.repeat(Math.round(s.averageRating))} {s.averageRating}</span> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onSuccess={() => { setShowAddUser(false); loadUsers(); }} />}
      {showAddStore && <AddStoreModal onClose={() => setShowAddStore(false)} onSuccess={() => { setShowAddStore(false); loadStores(); }} />}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">User Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Address:</strong> {selectedUser.address}</div>
              <div><strong>Role:</strong> <span className={`badge ${roleBadge[selectedUser.role]}`}>{selectedUser.role}</span></div>
              {selectedUser.role === 'STORE_OWNER' && selectedUser.averageRating && (
                <div><strong>Store Average Rating:</strong> ⭐ {selectedUser.averageRating}</div>
              )}
            </div>
            <div className="modal-footer"><button className="btn btn-primary" onClick={() => setSelectedUser(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
