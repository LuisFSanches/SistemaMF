import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';

export const handleMulterError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(
                new BadRequestException(
                    'File is too large. Maximum size is 100KB',
                    ErrorCodes.VALIDATION_ERROR
                )
            );
        }
        
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(
                new BadRequestException(
                    'Unexpected field in form data',
                    ErrorCodes.VALIDATION_ERROR
                )
            );
        }

        return next(
            new BadRequestException(
                err.message,
                ErrorCodes.VALIDATION_ERROR
            )
        );
    }

    // Se não for erro do Multer, passa para o próximo middleware
    next(err);
};
