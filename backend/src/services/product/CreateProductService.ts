import { IProduct } from '../../interfaces/IProduct';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

export class CreateProductService {
    async execute(data: IProduct) {
        try {
            const product = await prismaClient.product.create({
                data,
            });
    
            return product;
        } catch (error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}
