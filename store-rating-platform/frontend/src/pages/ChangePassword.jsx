import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(form.newPassword)) {
      setError('Password must be 8-16 chars with at least one uppercase letter and one special character');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally { setLoading(false); }
  };

  const f = key => e => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="page">
      <Navbar />
      <div className="main-content" style={{ maxWidth: 480 }}>
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Change Password</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={form.currentPassword} onChange={f('currentPassword')} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" value={form.newPassword} onChange={f('newPassword')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={form.confirmPassword} onChange={f('confirmPassword')} required />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
