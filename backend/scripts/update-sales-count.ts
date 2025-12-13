/**
 * Script para atualizar contadores de vendas dos produtos
 * Versão TypeScript para desenvolvimento local
 * 
 * Executar com: npm run update-sales-count
 */

import { UpdateProductSalesCountService } from '../src/services/product/UpdateProductSalesCountService';

async function main() {
    try {
        console.log('[Script] Starting sales count update at', new Date().toISOString());
        
        const service = new UpdateProductSalesCountService();
        const result = await service.execute();
        
        console.log('[Script] Sales count update completed successfully:', result);
        process.exit(0);
    } catch (error) {
        console.error('[Script] Sales count update failed:', error);
        process.exit(1);
    }
}

main();
