import { useNavigate } from "react-router-dom";
import { fetchTicket, DeleteTicket, updateTicketStatus } from "../api/api.js";
import { useEffect, useState } from "react";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "../utils/toast.js";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const getTickets = async () => {
    try {
      const res = await fetchTicket();
      setTickets(res.tickets || []);
    } catch (err) {
      console.log(err);
      showError("Failed to load tickets");
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  const employeeTickets = tickets.filter(
    (ticket) => ticket.employee_id === user.id,
  );
  const handleVerifyIssue = async (ticketId, value) => {
    console.log(ticketId, value);

    try {
      if (value === "Fixed") {
        await updateTicketStatus(ticketId, "WaitingApproval", "Fixed");
        showInfo("Issue marked as fixed and sent for approval");
      } else {
        await updateTicketStatus(ticketId, "WaitingApproval", "Not_Fixed");
        showInfo("Issue marked as not fixed and sent for approval");
      }

      getTickets();
    } catch (err) {
      console.log(err);
      showError("Failed to submit verification");
    }
  };

  const handleEdit = (ticketId) => {
    navigate(`/employee/create-ticket/${ticketId}`);
  };

  const handleDelete = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await DeleteTicket(selectedTicketId);
      showSuccess("Ticket deleted successfully");
      setTickets((prev) =>
        prev.filter((ticket) => ticket.id !== selectedTicketId),
      );

      setShowDeleteModal(false);
      setSelectedTicketId(null);
    } catch (err) {
      console.log(err);
      showError("Failed to delete ticket");
    }
  };

  const handleReopen = async (ticketId) => {
    console.log("Reopen Ticket:", ticketId);
    try {
      const status = "ReOpen";
      const confirm_status = "todo";
      await updateTicketStatus(ticketId, status, confirm_status);
      showWarning("Ticket has been reopened");
      getTickets();
    } catch (err) {
      console.log(err);
      showError("Failed to reopen ticket");
    }
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
                  <th>Employee ID</th>
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
                {employeeTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  employeeTickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td>{index + 1}</td>

                      <td>{ticket.employee_id}</td>

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
                        <span className="badge bg-primary">
                          {ticket.status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            ticket.confirm_status === "Fixed"
                              ? "bg-success"
                              : ticket.confirm_status === "Not_Fixed"
                                ? "bg-danger"
                                : ticket.confirm_status === "pending"
                                  ? "bg-warning text-dark"
                                  : "bg-secondary"
                          }`}
                        >
                          {ticket.confirm_status}
                        </span>
                      </td>

                      <td>
                        {ticket.status === "Resolved" ? (
                          <>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`verify-${ticket.id}`}
                                value="Fixed"
                                onChange={(e) =>
                                  handleVerifyIssue(ticket.id, e.target.value)
                                }
                              />
                              <label className="form-check-label">Fixed</label>
                            </div>

                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`verify-${ticket.id}`}
                                value="Not_Fixed"
                                onChange={(e) =>
                                  handleVerifyIssue(ticket.id, e.target.value)
                                }
                              />
                              <label className="form-check-label">
                                Not Fixed
                              </label>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted">
                            Waiting for Resolution
                          </span>
                        )}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Ticket Deletion</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete this ticket?
                </p>

                <small className="text-danger">
                  This action cannot be undone.
                </small>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
