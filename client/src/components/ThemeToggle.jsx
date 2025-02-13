import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/themeSlice.js';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = theme;
  }, [theme]);

  return (
    <button
      onClick={handleToggle}
      className="p-2 px-4 rounded outline-none cursor-pointer bg-primary-light dark:bg-primary-dark text-text-dark border border-secondary-light dark:border-secondary-dark transition duration-300"
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
};

export default ThemeToggle;
