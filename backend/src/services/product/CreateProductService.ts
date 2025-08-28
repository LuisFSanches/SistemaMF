import { IProduct } from '../../interfaces/IProduct';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

export class CreateProductService {
    async execute(data: IProduct) {
        try {
            const product = await prismaClient.product.create({
                data,
            });
    
            return product;
        } catch (error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}
