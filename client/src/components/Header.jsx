import { Search, TvMinimalPlay, Menu, X } from 'lucide-react';
import { ThemeToggle, ProfileDropdown, Button } from '../components';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background-light dark:bg-background-dark shadow-md border-b border-secondary-light dark:border-secondary-dark transition duration-300">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <TvMinimalPlay size={30} className="text-primary-light dark:text-primary-dark" />
          <Link
            to="/"
            className="text-primary-light dark:text-primary-dark font-bold text-2xl outline-none"
            aria-label="Go to homepage"
          >
            uTube
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              text={<Search size={20} aria-hidden="true" />}
              onClick={() => navigate(`/search`)}
              variant="secondary"
              className="px-2 border-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              aria-label="Search"
            />
          )}
          {isAuthenticated && <ProfileDropdown />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
