
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DocsLayout() {
    return (
        <div className="flex h-full">
            {/* Sidebar - Scrolls Separately */}
            <Sidebar />

            {/* Main Content - Scrolls Independently */}
            <main className="docsLayoutContainer overflow-auto -none mb-5 ">
                <Outlet />
            </main>
        </div>
    );
}
