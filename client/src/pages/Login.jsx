import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Spinner, Button, Input } from '../components';
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

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setAlert({ type: 'warning', message: 'Email and password are required!' });
      return;
    }

    if (password.length < 6) {
      setAlert({ type: 'info', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.login(formData);

      if (response.statusCode < 400) {
        setAlert({ type: 'success', message: 'Login successful!' });
        setTimeout(() => {
          dispatch(
            login({
              user: response.message.user,
              accessToken: response.message.accessToken,
              refreshToken: response.message.refreshToken,
            })
          );
          localStorage.setItem('user', JSON.stringify(response.message.user));
          localStorage.setItem('refreshToken', response.message.refreshToken);
          navigate('/videos');
        }, 2000);
      } else {
        setAlert({ type: 'error', message: response.message || 'Login failed.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Login failed.' });
    }
    setLoading(false);
  };

  const fillTestCredentials = () => {
    setFormData({
      email: 'shubham@gupta.com',
      password: '123456',
    });
    setAlert({ type: 'info', message: 'Test credentials filled!' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      {alert && (
        <div className="fixed top-15 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <div className="border p-8 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            icon={<Mail />}
            onChange={handleChange}
          />
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              icon={<Lock />}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <Button
            text={loading ? <Spinner /> : 'Login'}
            onClick={handleSubmit}
            isLoading={loading}
            variant="primary"
            className="w-full py-2"
          />
          <Button
            text={
              <div className="flex items-center gap-2">
                <User size={18} /> Use Test Credentials
              </div>
            }
            onClick={fillTestCredentials}
            variant="outline"
            className="w-full py-2"
          />
          <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
