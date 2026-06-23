import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white"
      style={{
        width: "260px",
        minHeight: "100vh",
      }}
    >
      <div className="p-4 border-bottom">
        <h5 className="mb-0 fw-bold">Ticket System</h5>

        <small className="text-light">Admin Panel</small>
      </div>

      <div className="p-3">
        <NavLink to="/admin" className="nav-link text-white mb-2">
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="nav-link text-white mb-2">
          <i className="bi bi-people me-2"></i>
          Manage Users
        </NavLink>

        <NavLink to="/admin/tickets" className="nav-link text-white mb-2">
          <i className="bi bi-ticket-detailed me-2"></i>
          Manage Tickets
        </NavLink>

        <hr />

        
      </div>
    </div>
  );
}

export default Sidebar;
