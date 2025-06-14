import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../ThemeProvider";
import Footer from "../components/Footer";

export default function Layout() {
    return (
        <div className="bg-brand-background dark:bg-dark-brand-background text-neutral-text-primary transition-colors duration-300 dark:bg-dark-neutral-surface dark:text-dark-text-primary">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}