import { Request, Response, NextFunction } from "express";
import { ValidateCouponService } from "../../services/coupon/ValidateCouponService";

class ValidateCouponController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { code, store_id, customerId, orderTotal } = req.body;

        const validateCouponService = new ValidateCouponService();

        const result = await validateCouponService.execute({
            code,
            store_id,
            customerId,
            orderTotal,
        });

        return res.json(result);
    }
}

export { ValidateCouponController };
