import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    avatar: null,
    coverImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.fullname ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.avatar
    ) {
      toast.error('All fields including avatar are required!');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    // Handle form submission logic here
  };

  const inputFields = [
    { name: 'fullname', type: 'text', icon: <User />, placeholder: 'Full Name' },
    { name: 'email', type: 'email', icon: <Mail />, placeholder: 'Email' },
    {
      name: 'password',
      type: showPassword ? 'text' : 'password',
      icon: <Lock />,
      placeholder: 'Password',
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border border-secondary-light dark:border-secondary-dark p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {inputFields.map((field, index) => (
            <div key={index} className="relative">
              <span className="absolute left-3 top-3 text-text-light dark:text-text-dark">
                {field.icon}
              </span>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-secondary-light dark:border-secondary-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-light dark:text-text-dark"
              />
            </div>
          ))}
          <div className="flex items-center justify-between relative">
            <label className="text-gray-700 dark:text-gray-300">Show Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div>
            <label className="block text-text-light dark:text-text-dark mb-1">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={handleFileChange}
              className="w-full p-2 border text-text-light dark:text-text-dark border-secondary-light dark:border-secondary-dark rounded-lg"
            />
          </div>
          <div>
            <label className="block text-text-light dark:text-text-dark mb-1">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              className="w-full text-text-light dark:text-text-dark p-2 border border-secondary-light dark:border-secondary-dark rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark py-3 rounded-lg "
          >
            Sign Up
          </button>
          <p className="text-center text-text-light dark:text-text-dark font-medium">
            Alerady have an account?{' '}
            <Link to="/login" className="text-primary-light dark:text-primary-dark">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
