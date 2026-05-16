import { Router } from "express"
import { getMyProfile, updateMyMedicalProfile, updateMyProfile } from "../controllers/patient.controller.js"
import { checkAuth } from "../middlewares/checkAuth.js"
import upload from "../middlewares/multer.js"

const patientRoutes = (supabase) => {
    const router = Router()

    router.get("/me", checkAuth, async (req, res) => {
        console.log("Patient: get my profile route hit")
        getMyProfile(req, res, supabase)
    })

    router.put("/me", checkAuth, upload.single("profile_image"), async (req, res) => {

        console.log("Patient: update my profile route hit")
        updateMyProfile(req, res, supabase)

    })

    router.put("/me/medical", checkAuth, async (req, res) => {
        console.log("Patient: update my medical profile route hit")
        updateMyMedicalProfile(req, res, supabase)
    })


    return router

}

export default patientRoutes