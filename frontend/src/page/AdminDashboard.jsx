import { useEffect, useState } from "react";
import { fetchAllUser, fetchTicket } from "../api/api.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );

  const getDashboardData = async () => {
    try {
      const userRes = await fetchAllUser();
      const ticketRes = await fetchTicket();

      setUsers(userRes.users || []);
      setTickets(ticketRes.tickets || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.status === "active").length;

  const inactiveUsers = users.filter(
    (user) => user.status === "inActive",
  ).length;

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "InProgress",
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved",
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "Closed",
  ).length;

  const recentTickets = [...tickets].sort((a, b) => b.id - a.id).slice(0, 5);
  const userChartData = {
    labels: ["Total Users", "Active Users", "Inactive Users"],
    datasets: [
      {
        label: "Users",
        data: [totalUsers, activeUsers, inactiveUsers],
        backgroundColor: [
          "#0d6efd", // blue
          "#198754", // green
          "#dc3545", // red
        ],
        borderRadius: 6,
      },
    ],
  };

  const ticketChartData = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Tickets",
        data: [openTickets, inProgressTickets, resolvedTickets, closedTickets],
        backgroundColor: [
          "#0d6efd", // blue
          "#ffc107", // yellow
          "#0dcaf0", // cyan
          "#198754", // green
        ],
        borderRadius: 6,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="container-fluid">
      <div className="col-md-3">
        <h3 className="fw-bold ">Admin Dashboard</h3>
        <p className="text-muted mb-0">
          Overview of users and ticket activities
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <h2 className="fw-bold ">{totalUsers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Active Users</h6>
              <h2 className="fw-bold mb-0 text-success">{activeUsers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Inactive Users</h6>
              <h2 className="fw-bold mb-0 text-danger">{inactiveUsers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Tickets</h6>
              <h2 className="fw-bold mb-0">{totalTickets}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Open</h6>
              <h2 className="fw-bold mb-0 text-primary">{openTickets}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">In Progress</h6>
              <h2 className="fw-bold mb-0 text-warning">{inProgressTickets}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Resolved</h6>
              <h2 className="fw-bold mb-0 text-info">{resolvedTickets}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Closed</h6>
              <h2 className="fw-bold mb-0 text-success">{closedTickets}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* User Summary */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">User Summary</h5>
            </div>

            <div className="card-body" style={{ height: "250px" }}>
              <Bar data={userChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Ticket Summary</h5>
            </div>

            <div className="card-body" style={{ height: "250px" }}>
              <Bar data={ticketChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      {/* Recent Tickets */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Tickets</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  recentTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.employee_id}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.department}</td>
                      <td>{ticket.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
