import { Request, Response, NextFunction } from "express";
import { DeleteCouponService } from "../../services/coupon/DeleteCouponService";

class DeleteCouponController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const deleteCouponService = new DeleteCouponService();

        const result = await deleteCouponService.execute(id, store_id);

        return res.json(result);
    }
}

export { DeleteCouponController };
