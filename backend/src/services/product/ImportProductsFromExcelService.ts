import * as XLSX from 'xlsx';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IImportProductsFromExcel {
    storeId: string;
    buffer: Buffer;
}

interface ProductRow {
    productId: string;
    productName: string;
    unity: string;
    price: number;
    stock: number;
    enabled: boolean;
    visibleForOnlineStore: boolean;
}

class ImportProductsFromExcelService {
    async execute({ storeId, buffer }: IImportProductsFromExcel) {
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
                    'A planilha não contém dados para importação',
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Validar e processar os dados
            const productsToCreate: ProductRow[] = [];
            const errors: string[] = [];

            for (let i = 0; i < dataRows.length; i++) {
                const row = dataRows[i];
                const rowNumber = i + 2; // +2 porque: +1 para índice baseado em 1, +1 para pular cabeçalho

                // Validar se a linha não está vazia
                if (!row[0] || row[0].toString().trim() === '') {
                    continue; // Ignora linhas vazias
                }

                const productId = row[0]?.toString().trim();
                const productName = row[1]?.toString().trim();
                const unity = row[2]?.toString().trim();
                const price = parseFloat(row[3]?.toString().replace(',', '.'));
                const stock = parseFloat(row[4]?.toString().replace(',', '.'));
                const enabledStr = row[5]?.toString().trim().toUpperCase();
                const visibleStr = row[6]?.toString().trim().toUpperCase();

                // Validações
                if (!productId) {
                    errors.push(`Linha ${rowNumber}: ID do Produto é obrigatório`);
                    continue;
                }

                if (!price || isNaN(price) || price <= 0) {
                    errors.push(`Linha ${rowNumber}: Preço de Venda é obrigatório e deve ser maior que zero`);
                    continue;
                }

                if (stock === undefined || isNaN(stock) || stock < 0) {
                    errors.push(`Linha ${rowNumber}: Estoque Inicial é obrigatório e deve ser maior ou igual a zero`);
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

                // Verificar se o produto pai existe
                const parentProduct = await prismaClient.product.findUnique({
                    where: { id: productId }
                });

                if (!parentProduct) {
                    errors.push(`Linha ${rowNumber}: Produto com ID ${productId} não encontrado`);
                    continue;
                }

                // Verificar se o produto já não existe para esta loja
                const existingStoreProduct = await prismaClient.storeProduct.findUnique({
                    where: {
                        store_id_product_id: {
                            store_id: storeId,
                            product_id: productId
                        }
                    }
                });

                if (existingStoreProduct) {
                    errors.push(`Linha ${rowNumber}: Produto '${productName}' já existe para esta loja`);
                    continue;
                }

                productsToCreate.push({
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

            if (productsToCreate.length === 0) {
                throw new BadRequestException(
                    'Nenhum produto válido foi encontrado na planilha para importação',
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Criar os store_products em massa
            const createdProducts = await prismaClient.$transaction(
                productsToCreate.map(product =>
                    prismaClient.storeProduct.create({
                        data: {
                            store_id: storeId,
                            product_id: product.productId,
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
                message: 'Produtos importados com sucesso',
                totalImported: createdProducts.length,
                products: createdProducts
            };

        } catch(error: any) {
            console.error("[ImportProductsFromExcelService] Failed:", error);
            
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

export { ImportProductsFromExcelService };
