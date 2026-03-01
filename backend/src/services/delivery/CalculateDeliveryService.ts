import { ICalculateDelivery } from "../../interfaces/ICalculateDelivery";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { calculateDeliverySchema } from "../../schemas/delivery/calculateDelivery";
import { BadRequestException } from "../../exceptions/bad-request";

function calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth radius in km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
}

class CalculateDeliveryService {
    async execute(data: ICalculateDelivery) {
        const parsed = calculateDeliverySchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const { storeId, customerLatitude, customerLongitude, city } = parsed.data;

        const attendedCity = await prismaClient.storeAttendedCity.findFirst({
            where: {
                store_id: storeId,
                city: { equals: city, mode: 'insensitive' },
            },
        });

        if (!attendedCity) {
            throw new BadRequestException(
                `Store does not deliver to the city: ${city}`,
                ErrorCodes.STORE_DOES_NOT_SERVE_CITY
            );
        }

        const store = await prismaClient.store.findUnique({
            where: { id: storeId },
            select: { latitude: true, longitude: true },
        });

        if (!store || store.latitude === null || store.longitude === null) {
            throw new BadRequestException(
                "Store location is not configured",
                ErrorCodes.STORE_LOCATION_NOT_SET
            );
        }

        const distanceKm = calculateDistanceKm(
            store.latitude,
            store.longitude,
            customerLatitude,
            customerLongitude
        );

        const deliveryRange = await prismaClient.deliveryRange.findFirst({
            where: {
                store_id: storeId,
                min_km: { lte: distanceKm },
                max_km: { gt: distanceKm },
            },
        });

        if (!deliveryRange) {
            throw new BadRequestException(
                `Delivery is not available for the distance of ${distanceKm}km`,
                ErrorCodes.OUT_OF_DELIVERY_RANGE
            );
        }

        return {
            distance_km: distanceKm,
            delivery_price: deliveryRange.price,
        };
    }
}

export { CalculateDeliveryService };
export { calculateDistanceKm };
