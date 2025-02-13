import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark">
      <Frown size={80} className="text-accent-light dark:text-accent-dark mb-4" />
      <h1 className="text-4xl font-bold">Oops! Page Not Found</h1>
      <p className="text-lg text-secondary-light dark:text-secondary-dark mt-2">
        The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-lg font-semibold rounded-lg bg-primary-light text-white 
                dark:bg-primary-dark dark:text-background-dark hover:brightness-110 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
}
