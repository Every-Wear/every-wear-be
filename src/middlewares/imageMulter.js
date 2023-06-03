import multer from "multer";
import path from "path";
import fs from "fs";

// image file save by static
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = (req.matchingUUID) ? `/app/static/${req.matchingUUID}` : `/app/static/dummy`; // 저장할 경로
        fs.mkdirSync(uploadPath, { recursive: true }); // 디렉토리 생성
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

export const upload = multer({ storage });