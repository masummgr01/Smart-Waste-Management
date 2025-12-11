import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { register as registerService } from '../../services/auth.js';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await registerService(registerData);
      login(response.user, response.token);
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="phone"
              type="tel"
              className="input-field"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
            />
            <select
              name="role"
              className="input-field"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </select>
            <input
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              type="password"
              required
              className="input-field"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;




