#!/usr/bin/env node

/**
 * Script CRON para atualizar contadores de vendas dos produtos
 * Deve ser executado uma vez por dia
 * 
 * Configuração no crontab (executar 1h antes do backup, às 2h da manhã):
 * 0 2 * * * cd /root/SistemaMF/backend && /usr/bin/node scripts/update-sales-count.js >> /var/log/update-sales-count.log 2>&1
 */

const { UpdateProductSalesCountService } = require('../dist/services/product/UpdateProductSalesCountService');

async function main() {
    try {
        console.log('[CRON] Starting sales count update at', new Date().toISOString());
        
        const service = new UpdateProductSalesCountService();
        const result = await service.execute();
        
        console.log('[CRON] Sales count update completed successfully:', result);
        process.exit(0);
    } catch (error) {
        console.error('[CRON] Sales count update failed:', error);
        process.exit(1);
    }
}

main();
