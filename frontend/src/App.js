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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        <Route path="/employee" element={<DashboardLayout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="create-ticket" element={<CreateTicketForm />} />
          <Route  path="create-ticket/:ticketId" element={<CreateTicketForm />}
          />
        </Route>

        <Route path="/agent" element={<DashboardLayout />}>
          <Route index element={<AgentDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
