import { Code2, Github, Linkedin, MessageCircleMore, Twitter } from 'lucide-react';

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
          <a
            href="https://github.com/GuptaShubham-11"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/guptashubham11/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://discord.gg/9WV6b6b7"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            <MessageCircleMore size={20} />
          </a>
          <a
            href="https://x.com/GuptaShubham91"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://leetcode.com/u/GuptaShubham-11/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-light dark:hover:text-primary-dark transition"
          >
            <Code2 size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
