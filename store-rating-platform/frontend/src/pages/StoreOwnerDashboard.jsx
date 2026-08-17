import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/store-owner/dashboard')
      .then(r => setData(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><Navbar /><div className="loading">Loading...</div></div>;
  if (error) return <div className="page"><Navbar /><div className="main-content"><div className="alert alert-error">{error}</div></div></div>;

  return (
    <div className="page">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Store Owner Dashboard</h1>
        </div>

        {data && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{data.averageRating ?? '—'}</h3>
                <p>Average Rating</p>
              </div>
              <div className="stat-card">
                <h3>{data.totalRatings}</h3>
                <p>Total Ratings</p>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Store Info</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div><span style={{ color: 'var(--muted)' }}>Name: </span>{data.store.name}</div>
                <div><span style={{ color: 'var(--muted)' }}>Email: </span>{data.store.email}</div>
                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--muted)' }}>Address: </span>{data.store.address}</div>
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Customer Ratings</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>CUSTOMER NAME</th>
                        <th>EMAIL</th>
                        <th>RATING</th>
                        <th>DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ratings.length === 0 ? (
                        <tr><td colSpan="4" className="empty">No ratings yet</td></tr>
                      ) : data.ratings.map((r, i) => (
                        <tr key={i}>
                          <td>{r.userName}</td>
                          <td>{r.userEmail}</td>
                          <td><span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span> {r.rating}/5</td>
                          <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
