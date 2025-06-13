import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../ThemeProvider";

export default function Layout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-brand-background dark:bg-dark-brand-background text-neutral-text-primary transition-colors duration-300 dark:bg-dark-neutral-surface dark:text-dark-text-primary duration-300 transition-all">
            <Navbar />
            <main className="flex-1 overflow-y-auto ">
                <Outlet />
            </main>
        </div>
    );
}