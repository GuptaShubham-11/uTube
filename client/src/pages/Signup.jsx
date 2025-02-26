import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ImageUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Spinner, Input, Button } from '../components';
import { userApi } from '../api/user.js';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    avatar: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email || !formData.password || !formData.avatar) {
      setAlert({ type: 'info', message: 'All fields including avatar are required!' });
      return;
    }
    if (formData.password.length < 6) {
      setAlert({ type: 'warning', message: 'Password must be at least 6 characters long.' });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    }

    setLoading(true);

    try {
      const response = await userApi.signUp(formDataToSend);
      setLoading(false);

      if (response.statusCode < 400) {
        setAlert({ type: 'success', message: 'Sign up successful!' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setAlert({ type: 'error', message: response.message || 'Sign up failed.' });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: 'error', message: error.message || 'Sign up failed.' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      {/* Alert Notification */}
      {alert && (
        <div className="fixed top-10 right-5 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <div className="border p-8 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
        {/* Signup Heading */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create an Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <Input
            type="text"
            name="fullname"
            placeholder="Full Name"
            icon={<User />}
            value={formData.fullname}
            onChange={handleChange}
          />

          {/* Email */}
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            icon={<Mail />}
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              icon={<Lock />}
              value={formData.password}
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

          {/* Profile Picture Upload */}
          <div className="relative">
            <Input
              type="file"
              name="avatar"
              accept="image/*"
              icon={<ImageUp />}
              onChange={handleFileChange}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full mx-auto mt-2"
              />
            )}
          </div>

          {/* Signup Button */}
          <Button
            text={loading ? <Spinner /> : 'Sign Up'}
            onClick={handleSubmit}
            className="w-full py-2"
          />

          {/* Login Redirect */}
          <p className="text-center text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
