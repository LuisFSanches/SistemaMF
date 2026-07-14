import { Request, Response, NextFunction } from "express";
import { UpdateCouponService } from "../../services/coupon/UpdateCouponService";

class UpdateCouponController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;
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

        const updateCouponService = new UpdateCouponService();

        const coupon = await updateCouponService.execute(id, store_id, {
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

export { UpdateCouponController };
