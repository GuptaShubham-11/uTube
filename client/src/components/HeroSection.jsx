import { useNavigate } from "react-router-dom";
import { Button } from "../components";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="text-center pt-24 pb-8 px-4 bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Hero Image */}
        <img
          src="/heroImage.svg"
          alt="Video Streaming"
          className="h-auto w-full max-w-md mx-auto mb-6 object-contain"
        />

        {/* Title & Subtitle */}
        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-primary-light dark:text-primary-dark leading-tight">
          Welcome to YouTube Clone
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-secondary-light dark:text-secondary-dark max-w-2xl">
          Watch, upload, and explore videos from around the world.
        </p>

        {/* Buttons */}
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            text="Sign Up"
            onClick={() => navigate("/signup")}
            variant="primary"
            className="px-6 py-3 text-lg w-full sm:w-auto"
          />
          <Button
            text="Login"
            onClick={() => navigate("/login")}
            variant="secondary"
            className="px-6 py-3 text-lg w-full sm:w-auto"
          />
        </div>
      </div>
    </section>
  );
}
