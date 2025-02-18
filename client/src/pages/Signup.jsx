import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ImageUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, Spinner, Input, Button } from '../components';
import { userApi } from '../api/user.js';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.files[0] });

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
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setAlert({ type: 'error', message: response.message || 'Sign up failed.' });
      }
    } catch (error) {
      setLoading(false);
      setAlert({ type: 'error', message: error.message || 'Sign up failed.' });
    }
  };

  const inputFields = [
    { name: 'fullname', type: 'text', icon: <User />, placeholder: 'Full Name' },
    { name: 'email', type: 'email', icon: <Mail />, placeholder: 'Email' },
    { name: 'avatar', type: 'file', icon: <ImageUp />, placeholder: 'Profile Picture', accept: 'image/*' },
    {
      name: 'password',
      type: showPassword ? 'text' : 'password',
      icon: <Lock />,
      placeholder: 'Password',
    },
  ];

  return (
    <div>
      {alert && (
        <div className="fixed top-25 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <div className="flex justify-center items-center min-h-screen">
        <div className="border p-8 rounded-lg shadow-lg w-full max-w-md bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {inputFields.map((field, index) => (
              <div key={index} className="relative">
                <Input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  icon={field.icon}
                  onChange={field.name === 'avatar' ? handleFileChange : handleChange}
                  accept={field.accept}
                />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300">Show Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-600 dark:text-gray-300"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <Button text={loading ? <Spinner /> : 'Sign Up'} onClick={handleSubmit} />
            <p className="text-center text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
