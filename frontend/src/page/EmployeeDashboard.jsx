import { useNavigate } from "react-router-dom";
import { fetchTicket } from "../api/api.js";
import { useEffect, useState } from "react";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  const getTickets = async () => {
    try {
      const res = await fetchTicket();
      setTickets(res.tickets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const handleVerifyIssue = (ticketId, checked) => {
    console.log(ticketId, checked ? "Fixed" : "Not_Fixed");

    // PATCH API later
  };

  const handleEdit = (ticketId) => {
    navigate(`/employee/create-ticket/${ticketId}`)  
  };

  const handleDelete = (ticketId) => {
    console.log("Delete Ticket:", ticketId);

    // DELETE API later
  };

  const handleReopen = (ticketId) => {
    console.log("Reopen Ticket:", ticketId);

    // PATCH API later
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Employee Dashboard</h3>

          <p className="text-muted mb-0">
            Manage and track your support tickets
          </p>
        </div>

        <button
          className="btn btn-warning"
          onClick={() => navigate("/employee/create-ticket")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Ticket
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">My Tickets</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Confirm Status</th>
                  <th>Verify Issue</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>

                    <td>{ticket.title}</td>

                    <td>{ticket.department}</td>

                    <td>
                      <span
                        className={`badge ${
                          ticket.urgency_level === "High"
                            ? "bg-danger"
                            : ticket.urgency_level === "Medium"
                              ? "bg-warning text-dark"
                              : "bg-success"
                        }`}
                      >
                        {ticket.urgency_level}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-primary">{ticket.status}</span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          ticket.confirm_status === "Fixed"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {ticket.confirm_status}
                      </span>
                    </td>

                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          disabled={ticket.status !== "Resolved"}
                          style={{
                            cursor:
                              ticket.status !== "Resolved"
                                ? "not-allowed"
                                : "pointer",
                          }}
                          onChange={(e) =>
                            handleVerifyIssue(ticket.id, e.target.checked)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`verify-${ticket.id}`}
                        >
                          is_issue_Fixed
                        </label>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={[
                            "InProgress",
                            "Resolved",
                            "Closed",
                          ].includes(ticket.status)}
                          onClick={() => handleEdit(ticket.id)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          disabled={ticket.status !== "Open"}
                          onClick={() => handleDelete(ticket.id)}
                        >
                          Delete
                        </button>

                        {ticket.status === "Closed" && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleReopen(ticket.id)}
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tickets.length === 0 && (
              <div className="text-center py-4 text-muted">
                No tickets found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
