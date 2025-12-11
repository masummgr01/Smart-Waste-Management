import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Header = () => {
  const { user, logout, isAdmin, isWorker } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Smart Waste Management
          </Link>
          
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600">
                    Admin Dashboard
                  </Link>
                )}
                {isWorker && (
                  <Link to="/worker/dashboard" className="text-gray-700 hover:text-primary-600">
                    Worker Dashboard
                  </Link>
                )}
                {user.role === 'user' && (
                  <Link to="/user/dashboard" className="text-gray-700 hover:text-primary-600">
                    My Requests
                  </Link>
                )}
                <span className="text-gray-700">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;




