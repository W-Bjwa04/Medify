import fs from "fs"
import getClient from "../config/imagekit.js"

const uploadFile = async (filePath, fileName) => {
    try {
        const imagekit = getClient()

        const response = await imagekit.files.upload({
            file: fs.createReadStream(filePath),
            fileName,
            folder: "/profiles"
        })

        return response

    } catch (error) {
        console.error("ImageKit upload error:", error)
        throw error
    }
}

export default { uploadFile }