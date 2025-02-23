import { Github, Linkedin, MessageCircleMore, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="p-6 text-center border-t 
        bg-background-light text-text-light border-secondary-light 
        dark:bg-background-dark dark:text-text-dark dark:border-secondary-dark transition duration-300"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto">
        <p className="font-semibold">© {new Date().getFullYear()} 🩷 Made by Gupta Shubham.</p>

        <div className="flex gap-4 mt-3 sm:mt-0">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light dark:hover:text-primary-dark transition">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light dark:hover:text-primary-dark transition">
            <Linkedin size={20} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light dark:hover:text-primary-dark transition">
            <MessageCircleMore size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-light dark:hover:text-primary-dark transition">
            <Twitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
