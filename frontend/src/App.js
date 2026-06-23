import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./page/Home.jsx";
import RegisterForm from "./component/RegisterForm.jsx";
import LoginForm from "./component/LoginForm.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import AdminDashboard from "./page/AdminDashboard.jsx";
import EmployeeDashboard from "./page/EmployeeDashboard.jsx";
import AgentDashboard from "./page/AgentDashboard.jsx";
import ManageUsers from "./page/ManageUsers";
import CreateTicketForm from "./component/CreateTicketForm.jsx";
import PublicRoute from "./Route/CreatePublicRoute.jsx";
import PrivateRoute from "./Route/CreatePrivateRoute.jsx";
import ManageTickets from "./page/ManageTickets.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="tickets" element={<ManageTickets />} />
        </Route>

        <Route
          path="/employee"
          element={
            <PrivateRoute allowedRoles={["employee"]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="create-ticket" element={<CreateTicketForm />} />
          <Route
            path="create-ticket/:ticketId"
            element={<CreateTicketForm />}
          />
        </Route>

        <Route
          path="/agent"
          element={
            <PrivateRoute
              allowedRoles={[
                "IT_dept_Agent",
                "HR_dept_Agent",
                "Finance_dept_agent",
                "Admin_dept_Agent",
              ]}
            >
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AgentDashboard />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
