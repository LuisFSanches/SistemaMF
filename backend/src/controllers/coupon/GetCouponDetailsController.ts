import { Request, Response, NextFunction } from "express";
import { GetCouponDetailsService } from "../../services/coupon/GetCouponDetailsService";

class GetCouponDetailsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const getCouponDetailsService = new GetCouponDetailsService();

        const coupon = await getCouponDetailsService.execute(id, store_id);

        return res.json(coupon);
    }
}

export { GetCouponDetailsController };
