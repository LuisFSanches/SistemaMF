import { IProduct } from '../../interfaces/IProduct';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

export class CreateProductService {
    async execute({ name, price, unity, stock }: IProduct) {
        try {
            const product = await prismaClient.product.create({
                data: {
                    name,
                    unity,
                    price,
                    stock,
                    enabled: true
                },
            });
    
            return product;
        } catch (error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}
