import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/themeSlice.js';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  // Toggle theme handler
  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  // Apply theme to <html> and <body>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button
      onClick={handleToggle}
      className="p-2 px-4 flex items-center gap-2 rounded cursor-pointer bg-primary-light dark:bg-primary-dark text-text-dark 
                 border border-secondary-light dark:border-secondary-dark transition-all duration-300"
    >
      {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
