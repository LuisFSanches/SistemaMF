import { Request, Response, NextFunction } from "express";
import { ListCouponsService } from "../../services/coupon/ListCouponsService";
import { CouponStatus } from "../../services/coupon/utils/getCouponStatus";

class ListCouponsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const status = req.query.status as CouponStatus | undefined;
        const search = req.query.search as string | undefined;

        const listCouponsService = new ListCouponsService();

        const result = await listCouponsService.execute({
            store_id,
            page,
            limit,
            status,
            search,
        });

        return res.json(result);
    }
}

export { ListCouponsController };
