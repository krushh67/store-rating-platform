import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const validate = ({ name, email, password, address }) => {
  if (name.length < 20 || name.length > 60) return 'Name must be between 20 and 60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Must be a valid email address';
  if (address.length > 400) return 'Address cannot exceed 400 characters';
  if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password))
    return 'Password must be 8-16 chars with at least one uppercase letter and one special character';
  return null;
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate(form);
    if (err) { setError(err); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = key => e => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the Store Rating Platform</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name (20-60 characters)</label>
            <input className="form-input" value={form.name} onChange={f('name')} required placeholder="e.g. John Alexander Smith" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={f('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" value={form.address} onChange={f('address')} required placeholder="Your address" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={f('password')} required />
            <div className="form-error" style={{ color: 'var(--muted)' }}>8-16 chars, one uppercase, one special character</div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
