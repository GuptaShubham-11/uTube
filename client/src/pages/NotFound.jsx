import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <Ghost size={100} className="text-accent-light dark:text-accent-dark mb-4 animate-bounce" />
      <h1 className="text-4xl font-bold text-center">Whoops! Lost in the void...</h1>
      <p className="text-lg text-secondary-light dark:text-secondary-dark mt-2 text-center">
        Even we can't find this page. Maybe it's on vacation? 🏖️
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-lg font-semibold rounded-lg bg-primary-light text-white 
                dark:bg-primary-dark dark:text-background-dark hover:scale-105 transition-transform duration-300"
      >
        Take me home 🏠
      </Link>
    </div>
  );
}
