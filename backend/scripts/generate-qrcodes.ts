import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateQRCodesForAllProducts() {
    console.log('🚀 Iniciando geração de QR Codes para produtos...\n');

    try {
        // Buscar todos os produtos
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                qr_code: true
            }
        });

        console.log(`📦 Total de produtos encontrados: ${products.length}\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        // Processar cada produto
        for (const product of products) {
            try {
                // Verificar se já possui QR Code
                if (product.qr_code) {
                    console.log(`⏭️  Pulando "${product.name}" - Já possui QR Code`);
                    skippedCount++;
                    continue;
                }

                // Gerar QR Code contendo o ID do produto
                const qrCodeDataURL = await QRCode.toDataURL(product.id, {
                    errorCorrectionLevel: 'M',
                    type: 'image/png',
                    width: 300,
                    margin: 1
                });

                // Atualizar produto com o QR Code
                await prisma.product.update({
                    where: { id: product.id },
                    data: { qr_code: qrCodeDataURL }
                });

                console.log(`✅ QR Code gerado para "${product.name}"`);
                updatedCount++;
            } catch (error) {
                console.error(`❌ Erro ao gerar QR Code para "${product.name}":`, error);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 RESUMO DA OPERAÇÃO:');
        console.log('='.repeat(50));
        console.log(`✅ Produtos atualizados: ${updatedCount}`);
        console.log(`⏭️  Produtos pulados (já possuíam QR Code): ${skippedCount}`);
        console.log(`❌ Erros: ${errorCount}`);
        console.log(`📦 Total processado: ${products.length}`);
        console.log('='.repeat(50) + '\n');

        console.log('✨ Script finalizado com sucesso!');
    } catch (error) {
        console.error('\n❌ Erro ao executar script:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o script
generateQRCodesForAllProducts()
    .then(() => {
        console.log('\n👋 Encerrando conexão com o banco de dados...');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erro fatal:', error);
        process.exit(1);
    });
