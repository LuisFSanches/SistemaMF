import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/root";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    const errorCode = error.errorCode || 'INTERNAL_ERROR';
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({
        message,
        errorCode,
    });
};