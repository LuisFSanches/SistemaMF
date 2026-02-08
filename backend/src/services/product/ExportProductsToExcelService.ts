import * as XLSX from 'xlsx';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IExportProductsToExcel {
    storeId: string;
}

class ExportProductsToExcelService {
    async execute({ storeId }: IExportProductsToExcel) {
        try {
            // Buscar produtos que o lojista ainda não possui
            // Usando a mesma lógica do GetAllProductService
            const productsRaw = await prismaClient.$queryRawUnsafe<any[]>(
                `
                    SELECT p.id, p.name, p.unity, p.price, p.stock
                    FROM "products" p
                    WHERE p.enabled = true
                    AND NOT EXISTS (
                        SELECT 1 FROM "store_products" sp 
                        WHERE sp.product_id = p.id AND sp.store_id = $1
                    )
                    ORDER BY p.sales_count DESC, p.created_at DESC
                `,
                storeId
            );

            if (productsRaw.length === 0) {
                throw new BadRequestException(
                    'Não há produtos disponíveis para importação. O lojista já possui todos os produtos ativos.',
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Preparar dados para a planilha
            const worksheetData = [
                // Cabeçalho
                ['ID do Produto', 'Nome do Produto', 'Unidade', 'Preço de Venda', 'Estoque Inicial', 'Ativo', 'Visível na Loja Online'],
                // Dados dos produtos
                ...productsRaw.map(product => [
                    product.id,
                    product.name,
                    product.unity,
                    '', // Preço de venda - a ser preenchido
                    '', // Estoque inicial - a ser preenchido
                    'SIM', // Ativo por padrão
                    'NAO' // Visível na loja online - desabilitado por padrão
                ])
            ];

            // Criar workbook e worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

            // Configurar largura das colunas
            worksheet['!cols'] = [
                { wch: 38 }, // ID do Produto
                { wch: 40 }, // Nome do Produto
                { wch: 10 }, // Unidade
                { wch: 15 }, // Preço de Venda
                { wch: 15 }, // Estoque Inicial
                { wch: 10 }, // Ativo
                { wch: 20 }  // Visível na Loja Online
            ];

            // Adicionar worksheet ao workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');

            // Gerar buffer do arquivo Excel
            const excelBuffer = XLSX.write(workbook, { 
                type: 'buffer', 
                bookType: 'xlsx' 
            });

            return {
                buffer: excelBuffer,
                filename: `produtos-importacao-${new Date().toISOString().split('T')[0]}.xlsx`,
                totalProducts: productsRaw.length
            };

        } catch(error: any) {
            console.error("[ExportProductsToExcelService] Failed:", error);
            
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

export { ExportProductsToExcelService };
