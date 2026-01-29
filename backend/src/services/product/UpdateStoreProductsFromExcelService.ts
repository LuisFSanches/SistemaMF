import * as XLSX from 'xlsx';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreProductsFromExcel {
    storeId: string;
    buffer: Buffer;
}

interface StoreProductUpdateRow {
    storeProductId: string;
    productId: string;
    productName: string;
    unity: string;
    price: number;
    stock: number;
    enabled: boolean;
    visibleForOnlineStore: boolean;
}

class UpdateStoreProductsFromExcelService {
    async execute({ storeId, buffer }: IUpdateStoreProductsFromExcel) {
        try {
            // Verificar se a loja existe
            const store = await prismaClient.store.findUnique({
                where: { id: storeId }
            });

            if (!store) {
                throw new BadRequestException(
                    'Loja não encontrada',
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Ler o arquivo Excel do buffer
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Converter para JSON (pula o cabeçalho)
            const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: '' 
            });

            // Remover cabeçalho
            const dataRows = rawData.slice(1);

            if (dataRows.length === 0) {
                throw new BadRequestException(
                    'A planilha não contém dados para atualização',
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Validar e processar os dados
            const productsToUpdate: StoreProductUpdateRow[] = [];
            const errors: string[] = [];

            for (let i = 0; i < dataRows.length; i++) {
                const row = dataRows[i];
                const rowNumber = i + 2; // +2 porque: +1 para índice baseado em 1, +1 para pular cabeçalho

                // Validar se a linha não está vazia
                if (!row[0] || row[0].toString().trim() === '') {
                    continue; // Ignora linhas vazias
                }

                const storeProductId = row[0]?.toString().trim();
                const productId = row[1]?.toString().trim();
                const productName = row[2]?.toString().trim();
                const unity = row[3]?.toString().trim();
                const price = parseFloat(row[4]?.toString().replace(',', '.'));
                const stock = parseFloat(row[5]?.toString().replace(',', '.'));
                const enabledStr = row[6]?.toString().trim().toUpperCase();
                const visibleStr = row[7]?.toString().trim().toUpperCase();

                // Validações
                if (!storeProductId) {
                    errors.push(`Linha ${rowNumber}: ID do Produto da Loja é obrigatório`);
                    continue;
                }

                if (!price || isNaN(price) || price <= 0) {
                    errors.push(`Linha ${rowNumber}: Preço de Venda é obrigatório e deve ser maior que zero`);
                    continue;
                }

                if (stock === undefined || isNaN(stock) || stock < 0) {
                    errors.push(`Linha ${rowNumber}: Estoque é obrigatório e deve ser maior ou igual a zero`);
                    continue;
                }

                if (!enabledStr || !['SIM', 'NAO', 'NÃO', 'YES', 'NO'].includes(enabledStr)) {
                    errors.push(`Linha ${rowNumber}: Campo 'Ativo' deve ser 'SIM' ou 'NAO'`);
                    continue;
                }

                if (!visibleStr || !['SIM', 'NAO', 'NÃO', 'YES', 'NO'].includes(visibleStr)) {
                    errors.push(`Linha ${rowNumber}: Campo 'Visível na Loja Online' deve ser 'SIM' ou 'NAO'`);
                    continue;
                }

                // Verificar se o store_product existe e pertence à loja
                const existingStoreProduct = await prismaClient.storeProduct.findUnique({
                    where: { id: storeProductId },
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                });

                if (!existingStoreProduct) {
                    errors.push(`Linha ${rowNumber}: Produto da loja com ID ${storeProductId} não encontrado`);
                    continue;
                }

                if (existingStoreProduct.store_id !== storeId) {
                    errors.push(`Linha ${rowNumber}: Produto '${productName}' não pertence a esta loja`);
                    continue;
                }

                // Verificar se o ID do produto pai não foi alterado
                if (existingStoreProduct.product_id !== productId) {
                    errors.push(`Linha ${rowNumber}: O ID do Produto Pai não pode ser alterado (produto: ${productName})`);
                    continue;
                }

                productsToUpdate.push({
                    storeProductId,
                    productId,
                    productName,
                    unity,
                    price,
                    stock,
                    enabled: ['SIM', 'YES'].includes(enabledStr),
                    visibleForOnlineStore: ['SIM', 'YES'].includes(visibleStr)
                });
            }

            // Se houver erros, retornar lista de erros
            if (errors.length > 0) {
                throw new BadRequestException(
                    `Foram encontrados ${errors.length} erro(s) na planilha:\n${errors.join('\n')}`,
                    ErrorCodes.VALIDATION_ERROR
                );
            }

            if (productsToUpdate.length === 0) {
                throw new BadRequestException(
                    'Nenhum produto válido foi encontrado na planilha para atualização',
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Atualizar os store_products em massa
            const updatedProducts = await prismaClient.$transaction(
                productsToUpdate.map(product =>
                    prismaClient.storeProduct.update({
                        where: { id: product.storeProductId },
                        data: {
                            price: product.price,
                            stock: product.stock,
                            enabled: product.enabled,
                            visible_for_online_store: product.visibleForOnlineStore
                        },
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    unity: true
                                }
                            }
                        }
                    })
                )
            );

            return {
                message: 'Produtos atualizados com sucesso',
                totalUpdated: updatedProducts.length,
                products: updatedProducts
            };

        } catch(error: any) {
            console.error("[UpdateStoreProductsFromExcelService] Failed:", error);
            
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

export { UpdateStoreProductsFromExcelService };
