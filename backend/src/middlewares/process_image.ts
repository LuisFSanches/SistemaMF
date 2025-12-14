import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';
import { productsUploadDir } from '../config/paths';

export const processImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next();
    }

    const inputPath = req.file.path;
    const date = new Date();
    const outputFilename = `optimized-${date.getTime()}-${req.file.filename}`;
    const outputPath = path.join(productsUploadDir, outputFilename);

    try {
        await sharp(inputPath)
            .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        const fileSizeInKB = stats.size / 1024;

        console.log('[processImage] Image processed. Size:', fileSizeInKB.toFixed(2), 'KB');

        if (fileSizeInKB > 100) {
            await sharp(inputPath)
                .resize(600, 600, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 60 })
                .toFile(outputPath);

            const newStats = fs.statSync(outputPath);
            const newFileSizeInKB = newStats.size / 1024;

            console.log('[processImage] Image recompressed. New size:', newFileSizeInKB.toFixed(2), 'KB');

            if (newFileSizeInKB > 100) {
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);

                return next(
                    new BadRequestException(
                        'Image is too large even after compression. Please upload a smaller image.',
                        ErrorCodes.VALIDATION_ERROR
                    )
                );
            }
        }

        fs.unlinkSync(inputPath);

        req.file.filename = outputFilename;
        req.file.path = outputPath;
        req.file.size = fs.statSync(outputPath).size;

        console.log('[processImage] Success. Final filename:', outputFilename);

        next();
    } catch (error: any) {
        console.error('[processImage] Failed:', error);

        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        next(
            new BadRequestException(
                'Failed to process image',
                ErrorCodes.SYSTEM_ERROR
            )
        );
    }
};
