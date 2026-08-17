import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ChangePassword from './pages/ChangePassword';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/store-owner" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute roles={['USER']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/store-owner" element={<ProtectedRoute roles={['STORE_OWNER']}><StoreOwnerDashboard /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute roles={['USER', 'STORE_OWNER', 'ADMIN']}><ChangePassword /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
