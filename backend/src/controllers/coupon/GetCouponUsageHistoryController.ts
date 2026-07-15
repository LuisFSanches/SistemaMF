import { Request, Response, NextFunction } from "express";
import { GetCouponUsageHistoryService } from "../../services/coupon/GetCouponUsageHistoryService";

class GetCouponUsageHistoryController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const getUsageHistoryService = new GetCouponUsageHistoryService();

        const result = await getUsageHistoryService.execute({
            couponId: id,
            store_id,
            page,
            limit,
        });

        return res.json(result);
    }
}

export { GetCouponUsageHistoryController };
