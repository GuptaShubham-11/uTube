import { Header, Footer } from '.';

export default function Layout({ children }) {
  return (
    <div className="bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition duration-300 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
