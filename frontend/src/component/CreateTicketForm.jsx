import { useForm } from "react-hook-form";
import { createTicket, fetchTicket, updateTicket } from "../api/api.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CreateTicketForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });
  const { ticketId } = useParams();
  const [tickets, setTickets] = useState([]);
  const getTickets = async () => {
    try {
      const res = await fetchTicket();
      setTickets(res.tickets);
    } catch (err) {
      console.log(err);
    }
  };
  const editForm = tickets.find((ticket) => ticket.id === Number(ticketId));
  useEffect(() => {
    if (!editForm) return;

    reset({
      title: editForm.title,
      description: editForm.description,
      department: editForm.department,
      urgency_level: editForm.urgency_level,
    });
  }, [editForm, reset]);
  
  useEffect(() => {
    getTickets();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      if (ticketId) {
        await updateTicket(ticketId, data);
      } else {
        const res = await createTicket(data);
      }
    } catch (err) {
      console.log(err);
    }

    reset();
  };

  return (
    <div className="container-fluid">
      <div className="card border-0 shadow-sm">
        <div
          className="card-header py-3"
          style={{
            background: "#FFF8E1",
          }}
        >
          <h4 className="mb-1 fw-bold">Create Support Ticket</h4>

          <p className="text-muted mb-0">
            Submit your issue to the appropriate department.
          </p>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Ticket Title</label>

              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Enter ticket title"
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 150,
                    message: "Maximum 150 characters allowed",
                  },
                })}
              />

              <div className="invalid-feedback">{errors.title?.message}</div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>

              <textarea
                rows="5"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                placeholder="Describe your issue in detail"
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>

              <div className="invalid-feedback">
                {errors.description?.message}
              </div>
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Department</label>

              <select
                className={`form-select ${
                  errors.department ? "is-invalid" : ""
                }`}
                {...register("department", {
                  required: "Please select a department",
                })}
              >
                <option value="">Select Department</option>

                <option value="IT_Dept">IT Department</option>

                <option value="HR_Dept">HR Department</option>

                <option value="Finance_Dept">Finance Department</option>

                <option value="admin_Dept">Admin Department</option>
              </select>

              <div className="invalid-feedback">
                {errors.department?.message}
              </div>
            </div>

            {/* Urgency */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Urgency Level</label>

              <select
                className={`form-select ${
                  errors.urgency_level ? "is-invalid" : ""
                }`}
                {...register("urgency_level", {
                  required: "Please select urgency level",
                })}
              >
                <option value="">Select Urgency</option>

                <option value="Low">Low</option>

                <option value="Medium">Medium</option>

                <option value="High">High</option>
              </select>

              <div className="invalid-feedback">
                {errors.urgency_level?.message}
              </div>
            </div>

            <button type="submit" className="btn btn-warning px-4">
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTicketForm;
