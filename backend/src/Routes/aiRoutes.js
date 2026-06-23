import express from "express";
import { categorizeTicket } from "../controllers/aiController.js";
import { generateSuggestedResponse } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/categorize", authMiddleware, categorizeTicket);
router.post("/suggest-response", generateSuggestedResponse);

export default router;
