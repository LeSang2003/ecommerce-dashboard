import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DarkModeToggle from "../components/DarkModeToggle";
import { Link } from "react-router-dom";
function MainLayout() {
  const location = useLocation();

  // nếu đang ở login thì không render layout
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 relative overflow-x-hidden w-full">
        {/* NÚT DARK MODE */}
        <div className="absolute top-4 right-6 z-50">
          <DarkModeToggle />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
