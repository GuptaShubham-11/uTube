import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, UserRoundCheck, CircleUserRound, Home } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { userApi } from '../api/user.js';
import { Alert, Spinner, Button } from '../components'; // Import Button

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on 'Esc' key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await userApi.logout();
      if (response.statusCode < 400) {
        dispatch(logout());
        navigate('/login');
        setAlert({ type: 'success', message: 'Logged out successfully!' });
      } else {
        setAlert({ type: 'error', message: 'Failed to logout.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Logout failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full border-2 border-accent-light dark:border-accent-dark 
                flex items-center justify-center bg-gray-200 dark:bg-gray-700 transition duration-300 cursor-pointer"
      >
        <User className="text-gray-600 dark:text-gray-300" size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-10 border dark:border-gray-700">
          <Button onClick={() => navigate('/')} variant="text">
            <Home size={18} /> Home
          </Button>
          <Button onClick={() => navigate('/upload')} variant="text">
            <Plus size={18} /> Upload
          </Button>
          <Button onClick={() => navigate('/subscription')} variant="text">
            <UserRoundCheck size={18} /> Subscription
          </Button>
          <Button onClick={() => navigate(`/channel/${user?._id}`)} variant="text">
            <CircleUserRound size={18} /> Me
          </Button>
          <Button onClick={handleLogout} variant="danger" isLoading={loading}>
            <LogOut size={18} /> Logout
          </Button>
        </div>
      )}
    </div>
  );
}
