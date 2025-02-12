import { Header, Footer } from ".";

export default function Layout({ children }) {
    return (
        <div className="bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition duration-300 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <Footer />
        </div>
    );
}
