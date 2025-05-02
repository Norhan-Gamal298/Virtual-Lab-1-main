import Navbar from "../components/Navbar";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Top Navbar */}
            <Navbar />

            {/* Main Content (Fills Remaining Space) */}
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
