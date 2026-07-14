import { Request, Response, NextFunction } from "express";
import { CreateCouponService } from "../../services/coupon/CreateCouponService";

class CreateCouponController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id as string;
        const {
            code,
            is_active,
            discount_type,
            discount_value,
            max_discount_amount,
            start_date,
            expiration_date,
            total_usage_limit,
            usage_limit_per_customer,
            specific_customer_id,
            minimum_order_amount,
        } = req.body;

        const createCouponService = new CreateCouponService();

        const coupon = await createCouponService.execute({
            store_id,
            code,
            is_active,
            discount_type,
            discount_value,
            max_discount_amount,
            start_date,
            expiration_date,
            total_usage_limit,
            usage_limit_per_customer,
            specific_customer_id,
            minimum_order_amount,
        });

        return res.json({ coupon });
    }
}

export { CreateCouponController };
