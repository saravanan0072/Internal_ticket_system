import { useEffect, useState } from "react";
import { fetchTicket } from "../api/api";

function ManageTickets() {
  const [tickets, setTickets] = useState([]);

  const getTickets = async () => {
    try {
      const res = await fetchTicket();
      setTickets(res.tickets || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">
        Manage Tickets
      </h3>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Confirm Status</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>

                  <td>{ticket.employee_id}</td>

                  <td>{ticket.title}</td>

                  <td>{ticket.department}</td>

                  <td>{ticket.urgency_level}</td>

                  <td>{ticket.status}</td>

                  <td>{ticket.confirm_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageTickets;