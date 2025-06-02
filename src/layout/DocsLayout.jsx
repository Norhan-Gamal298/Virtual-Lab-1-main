
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DocsLayout() {
    return (
        <div className="bg-inherit text-inherit flex h-full">
            <Sidebar />
            <main className="docsLayoutContainer overflow-auto bg-inherit">
                <Outlet />
            </main>
        </div>
    );
}
