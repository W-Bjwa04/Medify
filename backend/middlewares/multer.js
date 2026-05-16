import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")   // folder must exist in the root directory of the project
    }, 
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname
        cb(null, uniqueName)
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = fileTypes.test(file.mimetype)

        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb(new Error("Only images are allowed"))
        }
    }
})

export default upload