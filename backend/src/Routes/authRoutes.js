import express from 'express'
import {Register,login,updateRole,updateStatus,getAllUsers} from '../controllers/authController.js'

const router= express.Router()

router.post("/register",Register)
router.post("/login",login)
router.patch("/users/:id/role", updateRole);
router.patch("/users/:id/status", updateStatus);
router.get("/AllUsers", getAllUsers);




export default router