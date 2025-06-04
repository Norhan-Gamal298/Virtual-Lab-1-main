import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DocsLayout() {
    return (
        <div className="bg-neutral-surface text-neutral-text-primary flex h-full dark:bg-dark-neutral-surface dark:text-dark-neutral-text-primary">
            <Sidebar />
            <main className="overflow-auto bg-inherit w-full">
                <Outlet />
            </main>
        </div>
    );
}