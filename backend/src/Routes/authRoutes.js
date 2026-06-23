import express from 'express'
import {Register,login,updateUser,getAllUsers} from '../controllers/authController.js'

const router= express.Router()

router.post("/register",Register)
router.post("/login",login)
router.patch("/users/:id", updateUser);
router.get("/AllUsers", getAllUsers);




export default router