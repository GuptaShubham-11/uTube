import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('visitedHeroSection')) {
      setShowNotification(true);
      localStorage.setItem('visitedHeroSection', 'true');
    }
  }, []);

  return (
    <section className="text-center pt-24 pb-8 px-4 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Hero Image */}
        <motion.img
          src="/heroImage.svg"
          alt="Video Streaming"
          className="h-auto w-full max-w-md mx-auto mb-6 object-contain"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Heading */}
        <motion.h1
          className="mt-6 text-4xl sm:text-5xl font-extrabold text-primary-light dark:text-primary-dark leading-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Welcome to <span className="text-accent-light dark:text-accent-dark">uTube</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-lg sm:text-xl text-text-light dark:text-text-dark max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Watch, upload, and explore videos from around the world.
        </motion.p>

        {/* Buttons */}
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            text="Sign Up"
            onClick={() => navigate('/signup')}
            variant="primary"
            className="px-6 py-3 text-lg w-full sm:w-auto"
            aria-label="Sign up for an account"
          />
          <Button
            text="Login"
            onClick={() => navigate('/login')}
            variant="secondary"
            className="px-6 py-3 text-lg w-full sm:w-auto"
            aria-label="Log in to your account"
          />
        </div>
      </div>

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md text-center backdrop-blur-lg bg-opacity-95 dark:bg-opacity-90"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                ⚡ First-Time User Guide
              </h2>
              <div className="mt-3 text-gray-700 dark:text-gray-300 font-semibold">
                <p>
                  📝 <b>Testing Credentials:</b>
                </p>
                <p>
                  <b>Email:</b>{' '}
                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg">
                    shubham@gupta.com
                  </code>
                </p>
                <p>
                  <b>Password:</b>{' '}
                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-lg">123456</code>
                </p>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                ⚠️ Avoid uploading large videos due to free plan limits.
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                ⏳ Uploading may take some time.
              </p>
              <button
                onClick={() => setShowNotification(false)}
                className="mt-4 bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                aria-label="Close notification"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
