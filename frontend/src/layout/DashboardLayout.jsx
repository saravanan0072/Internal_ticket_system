import { Outlet } from "react-router-dom";
import Sidebar from "../page/AdminSidebar";
import Navbar from "../component/Navbar"

function DashboardLayout() {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <main className="p-4 bg-light min-vh-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;