import { Search, Bell, TvMinimalPlay, User } from "lucide-react";
import {
    ThemeToggle,
    ProfileDropdown,
} from ".";

export default function Header() {
    return (
        <header className="p-4 flex items-center justify-between shadow-md border-b 
            bg-background-light text-text-light border-secondary-light 
            dark:bg-background-dark dark:text-text-dark dark:border-secondary-dark transition duration-300">

            {/* Logo Section */}
            <div className="flex items-center gap-2">
                <TvMinimalPlay size={28} className="text-primary-light dark:text-primary-dark" />
                <h1 className="text-primary-light dark:text-primary-dark font-bold text-2xl">uTube</h1>
            </div>

            {/* Search Bar */}
            <div className="relative flex-grow max-w-lg">
                <input
                    type="text"
                    placeholder="Search videos..."
                    className="w-full px-4 py-2 rounded-full border bg-white text-text-light 
                        border-secondary-light focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
                    bg-primary-light text-white dark:bg-primary-dark dark:text-background-dark hover:brightness-110">
                    <Search size={18} />
                </button>
            </div>

            <div className="flex items-center gap-4">
                <ProfileDropdown />
                <ThemeToggle />
            </div>
        </header>
    );
}
