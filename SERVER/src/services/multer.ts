import multer from 'multer';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // npm i multer-storage-cloudinary --legacy-peer-deps
import cloudinary from "../config/cloudinary"

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: any) => {
        return {
            folder: 'react_todo_images',
            allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
        };
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export default upload;


// import multer from "multer";
// import fs from "fs";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = "uploads";
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

// export { upload };
