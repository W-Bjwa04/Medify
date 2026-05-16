import express from "express"
import { changePasswordController, loginController, registerController } from "../controllers/auth.controller.js"
import { checkAuth } from "../middlewares/checkAuth.js"

const authRoutes = (supabase) => {
    const router = express.Router()

    // Register Route 
    router.post("/register", (req, res) => {
        console.log("Register Route Hit")
        registerController(req, res, supabase)
    })

    // Login Route 

    router.post("/login", (req, res) => {
        console.log("Login Route Hit")
        loginController(req, res, supabase)
    })

    //Change Password
    router.post("/change-password", checkAuth, (req, res) => {
        console.log("Change Password Route Hit")
        changePasswordController(req, res, supabase)
    })

    return router
}


export default authRoutes