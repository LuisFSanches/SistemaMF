import QRCode from 'qrcode';
import { IProduct } from '../../interfaces/IProduct';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

export class CreateProductService {
    async execute(data: IProduct) {
        try {
            // Criar o produto primeiro para obter o ID
            const product = await prismaClient.product.create({
                data,
            });

            // Gerar QR Code contendo o ID do produto
            const qrCodeDataURL = await QRCode.toDataURL(product.id, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                width: 300,
                margin: 1
            });

            // Atualizar o produto com o QR Code gerado
            const updatedProduct = await prismaClient.product.update({
                where: { id: product.id },
                data: { qr_code: qrCodeDataURL }
            });
    
            return updatedProduct;
        } catch (error: any) {
            console.error("[CreateProductService] Failed:", error);
            
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}
