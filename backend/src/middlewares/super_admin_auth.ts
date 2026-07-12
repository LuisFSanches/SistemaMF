import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { UnauthorizedRequestException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import prismaClient from "../prisma";
import { IPayload } from "../interfaces/IPayload";
import { validateSubscription, isSubscriptionManagementRoute } from "../utils/validateSubscription";

const superAdminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    if (!token) {
        next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
        return;
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
                        created_at: true,
                        trial_end_date: true,
                    }
                }
            }
        });

        if (!admin) {
            next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
            return;
        }

        if (admin && !admin.store && admin.role !== 'SYS_ADMIN') {
            next(new UnauthorizedRequestException('Admin does not belong to any store', ErrorCodes.UNAUTHORIZED))
            return;
        }

        if (admin?.role !== 'SUPER_ADMIN' && admin?.role !== 'SYS_ADMIN') {
            next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
            return;
        }

        // Verificar assinatura apenas para SUPER_ADMIN (não para SYS_ADMIN)
        // E apenas se não for uma rota de gestão de assinatura
        if (
            admin.role === 'SUPER_ADMIN'
            && admin.store
            && !isSubscriptionManagementRoute(req.path)) {
            try {
                await validateSubscription(admin.store, true);
            } catch (error) {
                next(error);
                return;
            }
        }

        req.admin = admin!;
        next();
    }

    catch(error) {
        next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
    }
}

export default superAdminAuthMiddleware;