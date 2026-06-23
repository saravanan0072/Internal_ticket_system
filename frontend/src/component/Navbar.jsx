import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom px-4"
      style={{ height: "70px" }}
    >
      <div className="container-fluid">
        <h5 className="mb-0 fw-semibold">
          {user?.role} Dashboard
        </h5>

        <div className="d-flex align-items-center gap-3">
          <div className="text-end">
            <div className="fw-semibold">
              {user?.userName}
            </div>

            {user?.role === "admin" && (
              <small className="text-muted">
                Administrator
              </small>
            )}
          </div>

          <div
            className="rounded-circle bg-warning d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            <i className="bi bi-person-fill"></i>
          </div>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;