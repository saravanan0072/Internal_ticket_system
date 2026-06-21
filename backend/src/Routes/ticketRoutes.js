import express from 'express';
import {createTicket,getTickets,updateTickets,deleteTickets,updateTicketStatus} from '../controllers/ticketController.js'
import {authMiddleware} from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/",authMiddleware, createTicket);

router.get("/",authMiddleware, getTickets);

router.put("update/:id",authMiddleware, updateTickets);

router.delete("delete/:id",authMiddleware, deleteTickets);

router.patch("/:id",authMiddleware, updateTicketStatus);


export default router;