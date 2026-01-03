import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';
import { productsUploadDir, storesUploadDir } from './paths';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productsUploadDir);
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(16).toString('hex');
        const filename = `${hash}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

const storeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storesUploadDir);
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

export const uploadStore = multer({
    storage: storeStorage,
    fileFilter,
    limits: {
        fileSize: 500 * 1024, // 500KB para logo e banner
    }
});
