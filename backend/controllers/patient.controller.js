import storageService from "../services/storage.service.js"
import { promises as fs } from "fs"

// get my profile 


export const getMyProfile = async (req, res, supabase) => {
    try {
        console.log("Patient: get my profile controller hit")

        // get the logged in user from the req body 
        const loggedInUser = req.user


        // fetch the user profile data 

        const { data: userProfileData, error: userProfileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", loggedInUser.id)
            .single()

        if (userProfileError) {
            return res.status(404).json({
                message: "Unable to get user profile"
            })
        }

        // fecth the patient profile data 

        const { data: patientProfileData, error: patientProfileError } = await supabase
            .from("patient_profiles")
            .select("*")
            .eq("user_id", loggedInUser.id)
            .maybeSingle()

        if (patientProfileError) {
            return res.status(404).json({
                message: "Unable to get patient profile"
            })
        }




        // combine the data and send response
        const response = {
            user: userProfileData,
            patientProfile: patientProfileData || null,
            profileStatus: patientProfileData ? "exists" : "missing"
        }
        return res.status(200).json({
            user: response,
            message: "User profile fetched successfully"
        })
    } catch (error) {
        return res.status(404).json({
            message: "Unable to get user profile data"
        })
    }
}


// update my profile 

export const updateMyProfile = async (req, res, supabase) => {
    try {

        // get the logged in user from the req body
        const loggedInUser = req.user

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data provided for update"
            })
        }


        const allowedFields = ["email", "phone", "first_name", "last_name"]
        const updateData = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field]
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            })
        }


        if (req.file) {
            const filePath = req.file.path
            const fileName = req.file.filename


            const uploadResponse = await storageService.uploadFile(filePath, fileName)

            const imageUrl = uploadResponse?.url

            if (!imageUrl) {
                return res.status(500).json({
                    message: "Image upload failed"
                })
            }

            updateData.profile_image_url = imageUrl

            // delete local file after upload
            await fs.unlink(filePath)
        }
        const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update(updateData)
            .eq("id", loggedInUser.id)
            .select(
                `  id,
                email,
                first_name,
                last_name,
                phone,
                profile_image_url,
                created_at
                `
            )
            .single()

        if (updateError) {
            return res.status(400).json({
                message: "Unable to update profile"
            })
        }

        return res.status(200).json({
            data: updatedUser,
            message: "Profile updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the profile",
            error: error.message
        })
    }
}


// update my medical profile 

export const updateMyMedicalProfile = async (req, res, supabase) => {
    try {
        // get the logged in user from the req body
        const loggedInUser = req.user

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "No data provided for update"
            })
        }


        const allowedFields = ["date_of_birth", "gender", "blood_group", "allergies", "medical_history", "emergency_contact_name", "emergency_contact_phone", "address"]

        const updateData = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                // validate DOB
                if (field === "date_of_birth") {
                    // validate format
                    const dobRegex = /^\d{4}-\d{2}-\d{2}$/

                    if (!dobRegex.test(req.body[field])) {
                        return res.status(400).json({
                            message: "Date must be in YYYY-MM-DD format"
                        })
                    }
                }
                updateData[field] = req.body[field]
            }
        }

        console.log(updateData)
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            })
        }


        const { data: updatedMedicalRecord, error: updateError } = await supabase
            .from("patient_profiles")
            .upsert({
                user_id: loggedInUser.id,
                ...updateData
            })
            .select("*")
            .single()



        if (updateError) {
            return res.status(400).json({
                message: "Unable to update profile",
                error: updateError
            })
        }

        return res.status(200).json({
            data: updatedMedicalRecord,
            message: "Patient Profile updated successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating the patient profile",
            error: error.message
        })
    }
}