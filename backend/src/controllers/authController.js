import db from "../config/init_db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const role = "employee";
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `insert into userDetails(userName,email,password,role) values(?,?,?,?)`,
      [userName, email, hashedPassword, role],
    );
    res.status(201).json({
      success: true,
      message: "user registered successfully",
      id: result.insertId,
      userName: userName,
      email: email,
      role: role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query(`select * from userDetails where email=?`, [
      email,
    ]);
    if (users.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if (user.status === "inActive") {
      return res.json({
        success: false,
        message: "Account is deactivated. Contact administrator.",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      success: true,
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      message: "user login successfully",
      token: token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { role, status } = req.body;

    const [user] = await db.query(
      `SELECT * FROM userDetails
       WHERE id=?`,
      [id],
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const singleAgentRoles = [
      "IT_dept_Agent",
      "HR_dept_Agent",
      "Admin_dept_Agent",
      "Finance_dept_agent",
    ];

    if (role !== user[0].role && singleAgentRoles.includes(role)) {
      const [existingAgent] = await db.query(
        `SELECT id
           FROM userDetails
           WHERE role=?
           AND id != ?`,
        [role, id],
      );

      if (existingAgent.length > 0) {
        return res.status(400).json({
          success: false,
          message: `${role} already assigned`,
        });
      }
    }

    await db.query(
      `UPDATE userDetails
       SET role=?,
           status=?
       WHERE id=?`,
      [role, status, id],
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT
        id,
        userName,
        email,
        role,
        status
       FROM userDetails
       ORDER BY id ASC`,
    );

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    res.json({
      success: false,
      error: err.message,
    });
  }
};
