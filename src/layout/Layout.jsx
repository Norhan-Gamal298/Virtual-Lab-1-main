import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../ThemeProvider";

export default function Layout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[var(--color-neutral-surface)] text-[var(--color-neutral-text-primary)] transition-colors duration-300">
            <Navbar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}