import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DocsLayout() {
    return (
        <div className="bg-neutral-surface text-neutral-text-primary flex flex-col md:flex-row h-full dark:bg-dark-neutral-surface dark:text-dark-neutral-text-primary transition-colors duration-300">
            <Sidebar />
            <main className="overflow-auto bg-inherit w-full p-4 md:p-6">
                <Outlet />
            </main>
        </div>
    );
}