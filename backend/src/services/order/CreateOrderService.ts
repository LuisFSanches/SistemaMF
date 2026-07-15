import moment from 'moment-timezone';
import { IOrder } from "../../interfaces/IOrder";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { ApplyCouponService } from "../coupon/ApplyCouponService";

class CreateOrderService{
	async execute(data: IOrder, products: any, store_id?: string, store_slug?: string) {
		const { delivery_date } = data;

		console.log('final data', data)

		try {
			let resolvedStoreId = store_id;

			if (!resolvedStoreId) {
				if (!store_slug || store_slug.trim() === '') {
					throw new BadRequestException(
						'store_id ou slug são obrigatórios',
						ErrorCodes.VALIDATION_ERROR
					);
				}

				const store = await prismaClient.store.findUnique({
					where: { slug: store_slug }
				});

				console.log(`[CreateOrderService] Loja encontrada: ${store ? store.name : 'Nenhuma loja encontrada'}`);

				if (!store) {
					throw new BadRequestException(
						`Loja não encontrada com o slug: ${store_slug}`,
						ErrorCodes.USER_NOT_FOUND
					);
				}

				resolvedStoreId = store.id;
			}

			const formattedDeliveryDate = moment.utc(delivery_date)
				.tz('America/Sao_Paulo', true)
				.set({ hour: 12, minute: 0, second: 0 })
				.toDate();

			const lastOrder = await prismaClient.order.findFirst({
				where: { store_id: resolvedStoreId },
				orderBy: { code: 'desc' },
				select: { code: true }
			});

			const nextCode = lastOrder ? lastOrder.code + 1 : 1;

			const order = await prismaClient.order.create({
				data: {
					...data,
					code: nextCode,
					store_id: resolvedStoreId,
					delivery_date: formattedDeliveryDate,
					orderItems: {
						create: products.map((product: any) => ({
							store_product_id: product.id,
							quantity: Number(product.quantity),
							price: Number(product.price),
							store_id: resolvedStoreId,
						})),
					},
				},

				include: {
					client: true,
          			clientAddress: true
				}
		})

		if (data.coupon_id) {
			try {
				await new ApplyCouponService().execute({
					couponId: data.coupon_id,
					customerId: order.client_id,
					orderId: order.id,
					discountAmount: Number(data.discount) || 0,
				});
			} catch (couponError: any) {
				console.error("[CreateOrderService] Failed to apply coupon usage:", couponError);
			}
		}

		return order;

		} catch(error: any) {
			console.error("[CreateOrderService] Failed:", error);
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { CreateOrderService }
