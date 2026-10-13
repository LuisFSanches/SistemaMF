/**
 * Seeds the LOCAL database with a realistic slice of the production catalog as it exists
 * BEFORE product variants: one product per color, inconsistent names, legacy duplicates
 * and a few "false positives" (names containing a color word that are not color variants).
 *
 * Used to rehearse scripts/propose-variant-groups.ts + scripts/apply-variant-groups.ts
 * before running them in production.
 *
 * Usage: npx ts-node scripts/seed-legacy-color-products.ts [store-slug]   (default: miraiflores)
 */
import prismaClient from '../src/prisma';

interface ISeedProduct {
    name: string;
    price: number;          // global (products.price)
    store_price?: number;   // store_products.price when it differs from the global price
    stock: number;
    online?: boolean;       // store_products.visible_for_online_store
    sales_count: number;
    category?: string;      // category slug
    unity?: string;
}

// Names, prices and sales counts copied from production (2026-10-04)
const SEED_PRODUCTS: ISeedProduct[] = [
    // Buquê de 6 Rosas: canonical "| Cor:" products + legacy duplicates
    { name: 'Buquê de 6 Rosas | Cor: Vermelha', price: 60, store_price: 100, stock: 20, online: true, sales_count: 118, category: 'buques-de-flores' },
    { name: 'Buquê de 6 Rosas | Cor: Rosa', price: 100, stock: 15, online: true, sales_count: 105, category: 'buques-de-flores' },
    { name: 'Buquê de 6 Rosas | Cor: Amarela', price: 100, stock: 10, online: true, sales_count: 95, category: 'buques-de-flores' },
    { name: 'Buquê de 6 Rosas | Cor: chá', price: 100, stock: 0, sales_count: 0 },
    { name: 'Buquê de 6 Rosas Brancas', price: 100, stock: 5, sales_count: 10, category: 'buques-de-flores' },
    { name: 'Buquê de 6 Rosas Azuis ', price: 100, stock: 2, sales_count: 0 },
    { name: 'Buquê de 6 Rosas Vermelhas', price: 100, stock: 0, sales_count: 59, category: 'buques-de-flores' },
    { name: 'Buquê de 6 Rosas', price: 100, stock: 3, sales_count: 45 },

    // Buquê de 8 Rosas
    { name: 'Buquê de 8 Rosas | Cor: Vermelha', price: 95, store_price: 120, stock: 12, online: true, sales_count: 98, category: 'buques-de-flores' },
    { name: 'Buquê de 8 Rosas | Cor: Rosa', price: 120, stock: 4, sales_count: 0 },
    { name: 'Buquê com 8 rosas brancas', price: 120, stock: 2, sales_count: 0 },
    { name: 'Buquê com 8 rosa chá', price: 120, stock: 1, sales_count: 0 },

    // Buquê de 12 Rosas
    { name: 'Buquê de 12 Rosas | Cor: Vermelhas', price: 120, store_price: 150, stock: 10, online: true, sales_count: 93, category: 'buques-de-flores' },
    { name: 'Buquê de 12 Rosas | Coloridas', price: 120, store_price: 150, stock: 6, online: true, sales_count: 8, category: 'buques-de-flores' },
    { name: 'Buquê com 12 rosas brancas', price: 150, stock: 2, sales_count: 0 },
    { name: 'buquê 12 rosas amarelas', price: 150, stock: 2, sales_count: 0 },
    { name: 'Buquê de 12 Rosas Vermelhas ', price: 150, stock: 0, sales_count: 63, category: 'buques-de-flores' },

    // Cones
    { name: 'Cone c/ 2 Rosas | Cor: Vermelha', price: 40, store_price: 50, stock: 25, online: true, sales_count: 19, category: 'buques-de-flores' },
    { name: 'Cone c/ 2 Rosas | Cor: Branca ', price: 50, stock: 5, sales_count: 0 },
    { name: 'cone com 2 rosas rosa', price: 50, stock: 5, sales_count: 0 },
    { name: 'cone 2 rosas amarelas', price: 50, stock: 3, sales_count: 0 },
    { name: 'Cone 3 Rosas | Cor: Amarelas', price: 45, store_price: 75, stock: 8, online: true, sales_count: 1, category: 'buques-de-flores' },
    { name: 'Cone 3 Rosas | Branca', price: 50, store_price: 75, stock: 4, sales_count: 2 },
    { name: 'Cone 3 Rosas | Rosa ', price: 60, store_price: 75, stock: 6, sales_count: 26 },
    { name: 'Cone 3 Rosas | Chá', price: 75, stock: 2, sales_count: 0 },
    { name: 'cone 3 rosas vermelhas', price: 75, stock: 6, sales_count: 0 },

    // Kalanchoe: two naming styles + a duplicated white
    { name: 'Kalanchoe Pt11 | Cor: Vermelho', price: 15, stock: 30, online: true, sales_count: 27, category: 'plantas-em-vaso' },
    { name: 'Kalanchoe Pt11 | Cor: Rosa', price: 15, stock: 30, online: true, sales_count: 28, category: 'plantas-em-vaso' },
    { name: 'Kalanchoe Pt11 | Cor: Branco', price: 15, stock: 10, sales_count: 1 },
    { name: 'Kalanchoe Pt11 Variado', price: 15, stock: 50, online: true, sales_count: 190, category: 'plantas-em-vaso' },
    { name: 'Kalanchoé pote 11 cor Amarelo ', price: 15, stock: 8, sales_count: 0 },
    { name: 'Kalanchoé pote 11 cor Laranja ', price: 15, stock: 8, sales_count: 0 },
    { name: 'Kalanchoé pote 11 cor branca', price: 15, stock: 0, sales_count: 0 },

    // Botão de Rosa: price differs by color, duplicated red
    { name: 'Botão de Rosa Unidade | Cor: Vermelha', price: 10, store_price: 15, stock: 100, online: true, sales_count: 193, category: 'buques-de-flores' },
    { name: 'Botão de Rosa Vermelha', price: 15, stock: 10, sales_count: 7 },
    { name: 'Botão de Rosa Branca', price: 10, stock: 40, sales_count: 10 },
    { name: 'Botão de Rosa Rosa', price: 10, stock: 40, sales_count: 6 },
    { name: 'Botão de Rosa Amarela', price: 15, stock: 20, sales_count: 0 },
    { name: 'Botão de Rosa Azul', price: 15, stock: 10, sales_count: 0 },
    { name: 'Botão de Rosa Chá', price: 15, stock: 10, sales_count: 1 },
    { name: 'Botão de Rosa Laranja', price: 10, stock: 0, sales_count: 0 },
    { name: 'Botão de Rosa Pink', price: 10, stock: 5, sales_count: 0 },

    // Lírio Oriental Vaso: "(Oriental)" in the middle of the name
    { name: 'Lirio Rosa (Oriental) Vaso', price: 65, store_price: 45, stock: 6, sales_count: 49, category: 'plantas-em-vaso' },
    { name: 'Lirio Laranja (Oriental) Vaso', price: 45, stock: 4, sales_count: 16, category: 'plantas-em-vaso' },
    { name: 'Lirio Amarelo (Oriental) Vaso', price: 45, store_price: 35, stock: 3, sales_count: 0, category: 'plantas-em-vaso' },
    { name: 'Lirio Branco (Oriental) Vaso ', price: 65, stock: 2, sales_count: 7 },
    { name: 'Lirio Vermelho (Oriental) Vaso', price: 65, stock: 2, sales_count: 10 },

    // Moca de Astromélia: typo duplicate ("atromélia")
    { name: 'moca de astromélia vermelha', price: 30, stock: 5, sales_count: 0 },
    { name: 'moca de astromélia branca', price: 30, stock: 5, sales_count: 0 },
    { name: 'moca de astromélia rosa', price: 30, stock: 5, sales_count: 0 },
    { name: 'Moca de atromélia rosa', price: 30, stock: 2, sales_count: 0 },
    { name: 'Astromélia Moca Amarela ', price: 30, stock: 3, sales_count: 0 },

    // Hortênsia / Ipê
    { name: 'Hortencia Azul Pt15', price: 35, stock: 4, sales_count: 10 },
    { name: 'Hortencia Rosa Pt15', price: 45, stock: 4, sales_count: 8 },
    { name: "Ipê Muda 'Ipe' Amarelo", price: 20, stock: 6, sales_count: 4 },
    { name: "Ipê Muda 'Ipe' Rosa ", price: 20, stock: 6, sales_count: 5 },
    { name: "Ipê Muda 'Ipe' Roxo", price: 20, stock: 6, sales_count: 4 },
    { name: "Ipê Mudas 'Ipe' Branco", price: 20, stock: 6, sales_count: 3 },

    // False positives: color words that are NOT color variants
    { name: 'Rosa do Deserto Pt11 ', price: 25, stock: 5, sales_count: 3 },
    { name: 'Palmeira Azul (Bismarckia nobilis) G', price: 260, stock: 1, sales_count: 0 },
    { name: 'Fertilizante Ouro Verde 06.06.08 100ml', price: 16, stock: 10, sales_count: 2 },
    { name: 'Substrato Sumuverde 2kg', price: 15, stock: 10, sales_count: 4 },
    { name: 'Samambaia Azul Cuia 21 ', price: 35, stock: 3, sales_count: 1 },
    { name: 'Petalas de Rosa', price: 5, stock: 20, sales_count: 2 },

    // Unrelated products
    { name: 'Buquê com 6 Girassóis ', price: 150, stock: 8, online: true, sales_count: 19, category: 'buques-de-flores' },
    { name: 'Gerbera Vaso', price: 45, stock: 5, online: true, sales_count: 19, category: 'plantas-em-vaso' },
];

async function seedLegacyColorProducts() {
    const storeSlug = process.argv[2] || 'miraiflores';

    const store = await prismaClient.store.findUnique({ where: { slug: storeSlug } });

    if (!store) {
        throw new Error(`Store "${storeSlug}" not found`);
    }

    const categories = await prismaClient.category.findMany();
    const categoryBySlug = new Map(categories.map(category => [category.slug, category.id]));

    let created = 0;
    let skipped = 0;

    for (const item of SEED_PRODUCTS) {
        const existing = await prismaClient.product.findFirst({ where: { name: item.name } });

        if (existing) {
            skipped++;
            continue;
        }

        const categoryId = item.category ? categoryBySlug.get(item.category) : undefined;

        await prismaClient.product.create({
            data: {
                name: item.name,
                price: item.price,
                unity: item.unity || 'UN',
                stock: 0,
                enabled: true,
                sales_count: item.sales_count,
                categories: categoryId ? { create: [{ category_id: categoryId }] } : undefined,
                storeProducts: {
                    create: [{
                        store_id: store.id,
                        price: item.store_price ?? item.price,
                        stock: item.stock,
                        enabled: true,
                        visible_for_online_store: item.online ?? false,
                    }]
                }
            }
        });

        created++;
    }

    console.log(`[SeedLegacyColorProducts] Store: ${store.name} | created: ${created} | skipped (already exist): ${skipped}`);
}

seedLegacyColorProducts()
    .catch(error => {
        console.error('[SeedLegacyColorProducts] Failed:', error);
        process.exitCode = 1;
    })
    .finally(() => prismaClient.$disconnect());
