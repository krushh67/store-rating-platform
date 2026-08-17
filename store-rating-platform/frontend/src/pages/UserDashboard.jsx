import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="rating-select">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" className={`star-btn ${(hovered || value) >= n ? 'active' : ''}`}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(n)}>★</button>
      ))}
    </div>
  );
}

function RatingModal({ store, onClose, onSuccess }) {
  const [rating, setRating] = useState(store.userRating || 0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a rating'); return; }
    setLoading(true); setError('');
    try {
      const method = store.userRating ? 'put' : 'post';
      await api[method](`/stores/${store.id}/rating`, { rating });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">{store.userRating ? 'Update Rating' : 'Rate Store'}</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>{store.name}</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <StarRating value={rating} onChange={setRating} />
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{rating ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !rating}>
            {loading ? 'Submitting...' : store.userRating ? 'Update' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStores = useCallback(() => {
    setLoading(true);
    api.get('/stores', { params: { ...filters, ...sort } })
      .then(r => setStores(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { loadStores(); }, [loadStores]);

  const handleSort = field => setSort(s => ({ sortBy: field, order: s.sortBy === field && s.order === 'asc' ? 'desc' : 'asc' }));

  const SortIcon = ({ field }) => {
    if (sort.sortBy !== field) return <span style={{ color: '#cbd5e1' }}>↕</span>;
    return <span>{sort.order === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="page">
      <Navbar />
      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Browse Stores</h1>
        </div>

        <div className="filters">
          <div className="form-group search-input" style={{ marginBottom: 0 }}>
            <input className="form-input" placeholder="🔍 Search by store name..." value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
          </div>
          <div className="form-group search-input" style={{ marginBottom: 0 }}>
            <input className="form-input" placeholder="🔍 Search by address..." value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} />
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>STORE NAME <SortIcon field="name" /></th>
                  <th onClick={() => handleSort('address')}>ADDRESS <SortIcon field="address" /></th>
                  <th>OVERALL RATING</th>
                  <th>YOUR RATING</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="loading">Loading stores...</td></tr>
                ) : stores.length === 0 ? (
                  <tr><td colSpan="5" className="empty">No stores found</td></tr>
                ) : stores.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.address}</td>
                    <td>
                      {s.averageRating
                        ? <div className="rating-display"><span className="stars">⭐</span><strong>{s.averageRating}</strong><span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>/5</span></div>
                        : <span style={{ color: 'var(--muted)' }}>No ratings yet</span>}
                    </td>
                    <td>
                      {s.userRating
                        ? <span className="stars">{'★'.repeat(s.userRating)}{'☆'.repeat(5 - s.userRating)}</span>
                        : <span style={{ color: 'var(--muted)' }}>Not rated</span>}
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => setSelectedStore(s)}>
                        {s.userRating ? 'Edit Rating' : 'Rate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onSuccess={() => { setSelectedStore(null); loadStores(); }}
        />
      )}
    </div>
  );
}
