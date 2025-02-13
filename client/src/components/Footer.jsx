export default function Footer() {
  return (
    <footer
      className="p-4 text-center border-t 
            bg-background-light text-text-light border-secondary-light 
            dark:bg-background-dark dark:text-text-dark dark:border-secondary-dark transition duration-300"
    >
      <p>© {new Date().getFullYear()} Built with 📺 by Gupta Shubham.</p>
    </footer>
  );
}
