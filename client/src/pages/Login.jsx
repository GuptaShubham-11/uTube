import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Spinner } from '../components';
import { userApi } from '../api/user.js';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice.js';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setAlert({ type: 'warning', message: 'Email and password are required!' });
      return;
    }
    if (formData.password.length < 6) {
      setAlert({ type: 'info', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.login(formData);
      setLoading(false);

      if (response.statusCode < 400) {
        setAlert({ type: 'success', message: 'Login successful!' });

        setTimeout(() => {
          dispatch(login({
            user: response.message.user,
            accessToken: response.message.accessToken,
            refreshToken: response.message.refreshToken
          }));

          localStorage.setItem("user", JSON.stringify(response.message.user));

          navigate("/videos");
        }, 3000);
      } else {
        setAlert({ type: 'error', message: response.message || 'Login failed.' });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: 'error', message: error.message || 'Login failed.' });
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      {alert && (
        <div className="fixed top-25 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <div className="border border-secondary-light dark:border-secondary-dark p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-text-light dark:text-text-dark" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary text-gray-800 dark:text-white"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-text-light dark:text-text-dark" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary text-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-light dark:bg-primary-dark text-white py-3 rounded-lg hover:bg-primary-dark"
          >
            {loading ? <Spinner /> : 'Login'}
          </button>
          <p className="text-center text-text-light dark:text-text-dark font-medium">
            Create a new account?{' '}
            <Link to="/signup" className="text-primary-light dark:text-primary-dark">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
