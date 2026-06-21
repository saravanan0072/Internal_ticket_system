import db from "../config/init_db.js";

export const createTicket = async (req, res) => {
  try {
    const { id: employee_id } = req.user;
    const { title, description, department, urgency_level } = req.body;
    if (req.user.role !== "employee") {
      return res.json({ message: "only employees can create tickets" });
    }
    const [result] = await db.query(
      `INSERT INTO ticketDetails
      (title,description,department,urgency_level,employee_id)
      VALUES(?,?,?,?,?)`,
      [title, description, department, urgency_level, employee_id],
    );
    res.status(201).json({
      success: true,
      message: "ticket created successfully",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const [tickets] = await db.query(
      `select * from ticketDetails order by created_at desc`,
    );
    if (tickets.length === 0) {
      res.json({ message: "tickets not found" });
    }
    res.status(200).json({ tickets: tickets, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTickets = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, department, urgency_level, employee_id } =
      req.body;

    if (req.user.role !== "employee") {
      return res.json({ message: "only employees can update tickets" });
    }

    await db.query(`update ticketDetails set title=?,description=?,department=?,urgency_level=? where id=?
        [title,description,department,urgency_level,id]`);
    res.status(200).json({ message: "tickes update sucessfully", id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTickets = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "employee") {
      return res.json({ message: "only employees can delete tickets" });
    }
    await db.query(`delete from ticketDetails where id=?`, [id]);
    res.status(200).json({
      success: true,
      message: "Ticket Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, confirm_status } = req.body;
    if (confirm_status) {
      await db.query(
        `UPDATE ticketDetails
         SET status = ?, confirm_status = ?
         WHERE id = ?`,
        [status, confirm_status, id],
      );
    } else {
      await db.query(
        `UPDATE ticketDetails
         SET status = ?
         WHERE id = ?`,
        [status, id],
      );
    }

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      id: id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
