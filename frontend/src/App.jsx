import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import Header from './components/common/Header.jsx';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';

// User Pages
import UserDashboardPage from './pages/User/UserDashboardPage.jsx';
import RequestPickupPage from './pages/User/RequestPickupPage.jsx';
import UserStatusPage from './pages/User/UserStatusPage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/Admin/AdminDashboardPage.jsx';
import AdminMapPage from './pages/Admin/AdminMapPage.jsx';
import AdminAnalyticsPage from './pages/Admin/AdminAnalyticsPage.jsx';

// Worker Pages
import WorkerDashboardPage from './pages/Worker/WorkerDashboardPage.jsx';
import WorkerTaskDetailsPage from './pages/Worker/WorkerTaskDetailsPage.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen">
            <Header />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* User Routes */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/request-pickup"
                element={
                  <ProtectedRoute requiredRole="user">
                    <RequestPickupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/status/:id"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserStatusPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/map"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminMapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminAnalyticsPage />
                  </ProtectedRoute>
                }
              />

              {/* Worker Routes */}
              <Route
                path="/worker/dashboard"
                element={
                  <ProtectedRoute requiredRole="worker">
                    <WorkerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/task/:id"
                element={
                  <ProtectedRoute requiredRole="worker">
                    <WorkerTaskDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route
                path="/"
                element={
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-4">Welcome to Smart Waste Management</h1>
                    <p className="text-gray-600">
                      Please login or register to continue.
                    </p>
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;




