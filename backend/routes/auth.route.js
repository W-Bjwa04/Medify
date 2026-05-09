import express from "express"
import { loginController, registerController } from "../controllers/auth.controller.js"

const authRoutes = (supabase) => {
    const router = express.Router()

    // Register Route 
    router.post("/register", (req, res) => (
        registerController(req, res, supabase)
    ))

    // Login Route 

    router.post("/login", (req, res) => (
        loginController(req, res, supabase)
    ))

    return router
}


export default authRoutes