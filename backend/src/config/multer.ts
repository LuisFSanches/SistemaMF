import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';

const uploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'products');

// Criar diretório se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('[Multer] Upload directory created:', uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(16).toString('hex');
        const filename = `${hash}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestException(
            'Invalid file type. Only JPEG, JPG, PNG and WEBP are allowed',
            ErrorCodes.VALIDATION_ERROR
        ));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024, // 100KB
    }
});
