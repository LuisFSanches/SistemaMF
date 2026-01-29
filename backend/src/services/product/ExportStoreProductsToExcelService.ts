import * as XLSX from 'xlsx';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IExportStoreProductsToExcel {
    storeId: string;
}

class ExportStoreProductsToExcelService {
    async execute({ storeId }: IExportStoreProductsToExcel) {
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

            // Buscar produtos que o lojista já possui (store_products)
            const storeProducts = await prismaClient.storeProduct.findMany({
                where: { store_id: storeId },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unity: true
                        }
                    }
                },
                orderBy: [
                    { product: { name: 'asc' } }
                ]
            });

            if (storeProducts.length === 0) {
                throw new BadRequestException(
                    'Esta loja ainda não possui produtos cadastrados.',
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Preparar dados para a planilha
            const worksheetData = [
                // Cabeçalho
                ['ID do Produto da Loja', 'ID do Produto Pai', 'Nome do Produto', 'Unidade', 'Preço de Venda', 'Estoque', 'Ativo', 'Visível na Loja Online'],
                // Dados dos produtos
                ...storeProducts.map(sp => [
                    sp.id,
                    sp.product_id,
                    sp.product.name,
                    sp.product.unity,
                    Number(sp.price).toFixed(2),
                    Number(sp.stock).toFixed(2),
                    sp.enabled ? 'SIM' : 'NAO',
                    sp.visible_for_online_store ? 'SIM' : 'NAO'
                ])
            ];

            // Criar workbook e worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

            // Configurar largura das colunas
            worksheet['!cols'] = [
                { wch: 38 }, // ID do Produto da Loja
                { wch: 38 }, // ID do Produto Pai
                { wch: 40 }, // Nome do Produto
                { wch: 10 }, // Unidade
                { wch: 15 }, // Preço de Venda
                { wch: 15 }, // Estoque
                { wch: 10 }, // Ativo
                { wch: 20 }  // Visível na Loja Online
            ];

            // Adicionar worksheet ao workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Meus Produtos');

            // Gerar buffer do arquivo Excel
            const excelBuffer = XLSX.write(workbook, { 
                type: 'buffer', 
                bookType: 'xlsx' 
            });

            return {
                buffer: excelBuffer,
                filename: `meus-produtos-${new Date().toISOString().split('T')[0]}.xlsx`,
                totalProducts: storeProducts.length
            };

        } catch(error: any) {
            console.error("[ExportStoreProductsToExcelService] Failed:", error);
            
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

export { ExportStoreProductsToExcelService };
