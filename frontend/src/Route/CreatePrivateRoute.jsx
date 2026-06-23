import { Navigate } from "react-router-dom";

function PrivateRoute({
  children,
  allowedRoles,
}) {
  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(
      user?.role
    )
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default PrivateRoute;