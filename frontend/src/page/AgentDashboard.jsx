import {
  fetchTicket,
  updateTicketStatus,
  getSuggestedResponse,
} from "../api/api.js";
import { useEffect, useState } from "react";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "../utils/toast.js";

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const departmentMap = {
    IT_dept_Agent: "IT_Dept",
    HR_dept_Agent: "HR_Dept",
    Finance_dept_agent: "Finance_Dept",
    Admin_dept_Agent: "admin_Dept",
  };
  const [loadingId, setLoadingId] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [aiLoadingId, setAiLoadingId] = useState(null);
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

  const filteredTickets = tickets.filter(
    (ticket) => ticket.department === departmentMap[user.role],
  );

  const handleStatusChange = (id, status) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)),
    );
  };
  const updateStatus = async (ticket) => {
    try {
      setLoadingId(ticket.id);

      const status =
        ticket.status === "WaitingApproval" ? "Closed" : ticket.status;

      console.log("Sending status:", status);

      await updateTicketStatus(ticket.id, status);
      if (status === "InProgress") {
        showInfo("Ticket moved to In Progress");
      } else if (status === "Resolved") {
        showSuccess("Ticket resolved successfully");
      } else if (status === "Closed") {
        showSuccess("Ticket closed successfully");
      } else if (status === "ReOpen") {
        showWarning("Ticket moved back to Open");
      }
      getTickets();
    } catch (err) {
      console.log(err);
      showError("Failed to update ticket status");
    } finally {
      setLoadingId(null);
    }
  };
  const getAISuggestion = async (ticket) => {
    try {
      setAiLoadingId(ticket.id);

      const res = await getSuggestedResponse(ticket.description);

      setAiResponse(res.suggested_response);

      setShowModal(true);
    } catch (err) {
      console.log(err);

      showError("Failed to generate AI response because of server busy");
    } finally {
      setAiLoadingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold">Agent Dashboard</h3>

        <p className="text-muted">
          Manage department tickets and update their status
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Department Tickets</h5>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Confirm Status</th>
                  <th>AI Suggestion</th>
                  <th>changeStatus</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td>{index + 1}</td>
                      <td>{ticket.employee_id}</td>

                      <td>{ticket.title}</td>

                      <td>{ticket.description}</td>

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
                        <button
                          className="btn btn-info btn-sm"
                          disabled={aiLoadingId === ticket.id}
                          onClick={() => getAISuggestion(ticket)}
                        >
                          {aiLoadingId === ticket.id
                            ? "Generating..."
                            : "AI Reply"}
                        </button>
                      </td>

                      <td>
                        <select
                          className="form-select"
                          value={ticket.status}
                          onChange={(e) =>
                            handleStatusChange(ticket.id, e.target.value)
                          }
                        >
                          <option
                            value="Open"
                            disabled={
                              ticket.confirm_status === "pending" ||
                              ticket.confirm_status === "Fixed" ||
                              ticket.confirm_status === "Not_Fixed" ||
                              ticket.status === "ReOpen"
                            }
                          >
                            Open
                          </option>

                          <option
                            value="InProgress"
                            disabled={
                              ticket.confirm_status === "pending" ||
                              ticket.confirm_status === "Fixed"
                            }
                          >
                            In Progress
                          </option>

                          <option
                            value="Resolved"
                            disabled={
                              ticket.confirm_status === "pending" ||
                              ticket.confirm_status === "Fixed"
                            }
                          >
                            Resolved
                          </option>

                          <option value="WaitingApproval" disabled>
                            Waiting Approval
                          </option>

                          <option value="ReOpen" disabled>
                            ReOpen
                          </option>

                          <option
                            value="Closed"
                            disabled={ticket.confirm_status !== "Fixed"}
                          >
                            Closed
                          </option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          disabled={loadingId === ticket.id}
                          onClick={() => updateStatus(ticket)}
                        >
                          {loadingId === ticket.id ? "Updating..." : "Update"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
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
                <h5 className="modal-title">AI Suggested Response</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>{aiResponse}</p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentDashboard;
