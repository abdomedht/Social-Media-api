import multer from "multer";
import path from "node:path";
import fs from 'node:fs'
export const fileValidations = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'application/msword']
}
export const uploadFileDisk = (customPath = 'general', fileValidation = []) => {
    const basePath = `uploads/${customPath}`;
    const fullPath = path.resolve(`./src/${basePath}`)

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath)
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const finalFileName=file.originalname + '-' + uniqueSuffix
            file.finalPath= basePath+"/"+finalFileName
            cb(null,finalFileName )
        }
    });
    function fileFilter(req, file, cb) {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb("in-valid file form", false)
        }
    }

    return multer({ dest: 'uploads', fileFilter, storage });
}