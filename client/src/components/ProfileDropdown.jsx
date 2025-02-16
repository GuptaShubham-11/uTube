import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, UserRoundCheck, CircleUserRound, Home } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { userApi } from '../api/user.js';
import { Alert, Spinner } from '.';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="relative">
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border-2 border-accent-light dark:border-accent-dark 
                flex items-center justify-center bg-gray-200 dark:bg-gray-700 transition duration-300"
      >
        <User className="text-gray-600 dark:text-gray-300" size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 z-10 border dark:border-gray-700">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home size={18} /> Home
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 w-full px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Plus size={18} /> Create Video
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate('/subscribed')}
          >
            <UserRoundCheck size={18} /> Subscribed
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate('/me')}
          >
            <CircleUserRound size={18} /> Me
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-2 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={async () => {
              setLoading(true);
              try {
                const response = await userApi.logout();
                console.log(response);

                setLoading(false);

                if (response.statusCode < 400) {
                  setAlert({ type: 'success', message: 'Logout successful!' });

                  setTimeout(() => {
                    dispatch(logout());
                    navigate('/login');
                  }, 3000);
                } else {
                  setAlert({ type: 'error', message: 'Failed to logout.' });
                }
              } catch (error) {
                setLoading(false);
                setAlert({ type: 'error', message: error.message || 'Logout failed.' });
              }
            }}
          >
            {loading ? (<Spinner />) : (<LogOut size={18} />)} Logout
          </button>
        </div>
      )}
    </div>
  );
}
