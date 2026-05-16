import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()

const app = express()

// Middleware 
app.use(cors())
app.use(express.json())


// Initialize Supabase Client

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)


// Import routes 

import authRoutes from "./routes/auth.route.js"
import patientRoutes from "./routes/patient.routes.js"



// Auth Routes 
app.use("/api/auth", authRoutes(supabase))
// Patient Routes 
app.use("/api/patients", patientRoutes(supabase))


// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        status: err.status || 500,
    });
});

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})