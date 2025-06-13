import { Outlet } from "react-router-dom";

export default function BlogsLayout() {
  return (
    <div className="bg-neutral-surface text-neutral-text-primary flex min-h-screen dark:bg-dark-neutral-surface dark:text-dark-neutral-text-primary">
      {/* You can add a sidebar or header for blogs here if needed */}
      <main className="mx-auto w-full max-w-5xl py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
}
