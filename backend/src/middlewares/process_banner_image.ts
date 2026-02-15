import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';

export const processBannerImage = async (
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
    
    // Detectar o diretório de destino automaticamente baseado no path do arquivo original
    const uploadDir = path.dirname(inputPath);
    const outputPath = path.join(uploadDir, outputFilename);

    try {
        // Obter metadados da imagem
        const metadata = await sharp(inputPath).metadata();
        
        console.log('[processBannerImage] Original size:', metadata.width, 'x', metadata.height);
        console.log('[processBannerImage] Original file size:', (req.file.size / 1024).toFixed(2), 'KB');

        // Processar banner com dimensões 1440x300 e alta qualidade
        await sharp(inputPath)
            .resize(1440, 300, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 90 })
            .toFile(outputPath);

        const stats = fs.statSync(outputPath);
        const fileSizeInKB = stats.size / 1024;

        console.log('[processBannerImage] Banner processed. Size:', fileSizeInKB.toFixed(2), 'KB');

        // Limite de 2MB para banners
        if (fileSizeInKB > 2048) {
            // Se ainda for muito grande, tentar com qualidade 85
            await sharp(inputPath)
                .resize(1440, 300, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 85 })
                .toFile(outputPath);

            const newStats = fs.statSync(outputPath);
            const newFileSizeInKB = newStats.size / 1024;

            console.log('[processBannerImage] Banner reprocessed with quality 85. New size:', newFileSizeInKB.toFixed(2), 'KB');

            if (newFileSizeInKB > 2048) {
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);

                return next(
                    new BadRequestException(
                        'Banner is too large even after compression. Please upload a smaller image.',
                        ErrorCodes.VALIDATION_ERROR
                    )
                );
            }
        }

        fs.unlinkSync(inputPath);

        req.file.filename = outputFilename;
        req.file.path = outputPath;
        req.file.size = fs.statSync(outputPath).size;

        console.log('[processBannerImage] Success. Final filename:', outputFilename);
        console.log('[processBannerImage] Final size:', (req.file.size / 1024).toFixed(2), 'KB');

        next();
    } catch (error: any) {
        console.error('[processBannerImage] Failed:', error);

        if (fs.existsSync(inputPath)) {
            fs.unlinkSync(inputPath);
        }
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        next(
            new BadRequestException(
                'Failed to process banner image',
                ErrorCodes.SYSTEM_ERROR
            )
        );
    }
};
