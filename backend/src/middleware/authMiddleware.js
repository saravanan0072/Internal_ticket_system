import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ message: "unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
