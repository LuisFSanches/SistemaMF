import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { UnauthorizedRequestException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import prismaClient from "../prisma";
import { IPayload } from "../interfaces/IPayload";

const superAdminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    if (!token) {
        next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
    }

    try {
        const payload: IPayload = jwt.verify(token, process.env.JWT_SECRET!) as IPayload;
        const admin = await prismaClient.admin.findFirst({
            where: {
                id: payload.id
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        is_active: true,
                    }
                }
            }
        });

        if (!admin) {
            next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
        }

        if (admin && !admin.store) {
            next(new UnauthorizedRequestException('Admin does not belong to any store', ErrorCodes.UNAUTHORIZED))
        }

        if (admin?.role !== 'SUPER_ADMIN') {
            next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
        }

        req.admin = admin!;
        next();
    }

    catch(error) {
        next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
    }
}

export default superAdminAuthMiddleware;