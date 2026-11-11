
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-canvas">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content */}
      <div className="flex min-w-0 min-h-screen flex-col lg:pl-64">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
