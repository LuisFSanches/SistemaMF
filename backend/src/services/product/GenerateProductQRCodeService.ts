import QRCode from 'qrcode';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGenerateProductQRCode {
    id: string;
}

class GenerateProductQRCodeService {
    async execute({ id }: IGenerateProductQRCode) {
        try {
            // Verificar se o produto existe
            const product = await prismaClient.product.findUnique({
                where: { id }
            });

            if (!product) {
                throw new BadRequestException(
                    "Product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Gerar QR Code contendo apenas o ID do produto
            // O QR Code será uma string base64 em formato Data URL
            const qrCodeDataURL = await QRCode.toDataURL(id, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                width: 300,
                margin: 1
            });

            // Atualizar o produto com o QR Code gerado
            const updatedProduct = await prismaClient.product.update({
                where: { id },
                data: { qr_code: qrCodeDataURL },
                select: {
                    id: true,
                    name: true,
                    qr_code: true
                }
            });

            return updatedProduct;
        } catch (error: any) {
            console.error("[GenerateProductQRCodeService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GenerateProductQRCodeService };
