import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="text-center pt-25 bg-background-light dark:bg-background-dark">
      <h1 className="text-4xl font-bold text-primary-light dark:text-primary-dark">
        Welcome to YouTube Clone
      </h1>
      <p className="mt-4 text-secondary-light dark:text-secondary-dark">
        Watch, upload, and explore videos from around the world.
      </p>
      <button
        className="mt-6 px-6 py-3 bg-accent-light text-text-light dark:text-text-dark cursor-pointer dark:bg-accent-dark rounded-lg shadow-md hover:opacity-90"
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </button>
      <button
        className="mt-6 ml-3 px-6 py-3 cursor-pointer text-text-light dark:text-text-dark border border-secondary-light dark:border-secondary-dark  rounded-lg shadow-md hover:opacity-70"
        onClick={() => navigate('/login')}
      >
        Login
      </button>
    </section>
  );
}
