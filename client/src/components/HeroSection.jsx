import { useNavigate } from 'react-router-dom';
import { Button } from '../components';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="text-center pt-20 pb-16 px-4 bg-background-light dark:bg-background-dark">
      <h1 className="text-5xl font-extrabold text-primary-light dark:text-primary-dark">
        Welcome to YouTube Clone
      </h1>
      <p className="mt-4 text-lg text-secondary-light dark:text-secondary-dark">
        Watch, upload, and explore videos from around the world.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button text="Sign Up" onClick={() => navigate('/signup')} variant="primary" />
        <Button text="Login" onClick={() => navigate('/login')} variant="secondary" />
      </div>
    </section>
  );
}
