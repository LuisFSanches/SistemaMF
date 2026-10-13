/**
 * READ-ONLY. Analyzes product names and proposes color variant groups as a CSV for human review.
 * All queries run inside a READ ONLY transaction, so it is safe to point at production.
 *
 * Usage:
 *   npx ts-node scripts/propose-variant-groups.ts [output.csv]
 *   DATABASE_URL="postgresql://...:5433/sistemamf" npx ts-node scripts/propose-variant-groups.ts prod-proposal.csv
 *
 * CSV columns (";" separated, open in Excel/LibreOffice):
 *   action      GROUP      -> product will be attached to the group with the given color
 *               DUPLICATE  -> same color already taken by a better product in this group (no-op).
 *                             Change to DISABLE to hide it from the PDV/storefront when applying.
 *               NO_COLOR   -> same base as a group but no color in the name (no-op, for review)
 *               REVIEW     -> more than one color word found (no-op until edited to GROUP)
 *   Edit freely: change action, group_name or color, delete rows. Then run apply-variant-groups.ts.
 */
import fs from 'fs';
import path from 'path';
import prismaClient from '../src/prisma';
import { parseVariantName } from '../src/utils/variantNameParser';

export const CSV_COLUMNS = [
    'action', 'group_name', 'color', 'product_id', 'product_name',
    'sales_count', 'enabled', 'online_stores', 'store_count', 'note',
] as const;

type CsvRow = Record<typeof CSV_COLUMNS[number], string>;

function toCsv(rows: CsvRow[]) {
    const escape = (value: string) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [
        CSV_COLUMNS.join(';'),
        ...rows.map(row => CSV_COLUMNS.map(column => escape(row[column])).join(';')),
    ];
    // BOM so Excel opens accents correctly
    return '﻿' + lines.join('\n') + '\n';
}

async function proposeVariantGroups() {
    const outputPath = path.resolve(process.argv[2] || 'variant-groups-proposal.csv');

    const products = await prismaClient.$transaction(async (tx) => {
        await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');

        return tx.product.findMany({
            select: {
                id: true,
                name: true,
                enabled: true,
                sales_count: true,
                variant_group_id: true,
                storeProducts: {
                    select: { enabled: true, visible_for_online_store: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    });

    const candidates = products
        .filter(product => !product.variant_group_id)
        .map(product => ({
            ...product,
            parsed: parseVariantName(product.name),
            onlineStores: product.storeProducts.filter(sp => sp.enabled && sp.visible_for_online_store).length,
        }));

    const byKey = new Map<string, typeof candidates>();
    for (const candidate of candidates) {
        byKey.set(candidate.parsed.groupKey, [...(byKey.get(candidate.parsed.groupKey) || []), candidate]);
    }

    const rows: CsvRow[] = [];
    let groupCount = 0;

    for (const members of byKey.values()) {
        const colored = members.filter(member => member.parsed.colorName && member.parsed.colorTokens.length === 1);
        const distinctColors = new Set(colored.map(member => member.parsed.colorName));

        // A group only makes sense with at least two different colors
        if (distinctColors.size < 2) {
            continue;
        }

        groupCount++;

        // Best product first: visible online, then enabled, then most sold
        const ranked = [...members].sort((a, b) =>
            b.onlineStores - a.onlineStores
            || Number(b.enabled) - Number(a.enabled)
            || b.sales_count - a.sales_count
        );

        const groupName = (ranked.find(member => member.parsed.colorName) || ranked[0]).parsed.baseName;
        const takenColors = new Set<string>();

        for (const member of ranked) {
            const base = {
                group_name: groupName,
                product_id: member.id,
                product_name: member.name,
                sales_count: String(member.sales_count),
                enabled: member.enabled ? 'sim' : 'nao',
                online_stores: String(member.onlineStores),
                store_count: String(member.storeProducts.length),
            };

            if (!member.parsed.colorName) {
                rows.push({ ...base, action: 'NO_COLOR', color: '', note: 'Mesmo produto sem cor no nome' });
            } else if (member.parsed.colorTokens.length > 1) {
                rows.push({ ...base, action: 'REVIEW', color: member.parsed.colorName, note: `Varias cores no nome: ${member.parsed.colorTokens.join(', ')}` });
            } else if (takenColors.has(member.parsed.colorName)) {
                rows.push({ ...base, action: 'DUPLICATE', color: member.parsed.colorName, note: 'Cor ja usada por outro produto do grupo' });
            } else {
                takenColors.add(member.parsed.colorName);
                rows.push({ ...base, action: 'GROUP', color: member.parsed.colorName, note: '' });
            }
        }
    }

    rows.sort((a, b) => a.group_name.localeCompare(b.group_name) || a.action.localeCompare(b.action));

    fs.writeFileSync(outputPath, toCsv(rows), 'utf8');

    const countBy = (action: string) => rows.filter(row => row.action === action).length;
    console.log(`[ProposeVariantGroups] Products analyzed: ${products.length}`);
    console.log(`[ProposeVariantGroups] Groups proposed: ${groupCount}`);
    console.log(`[ProposeVariantGroups] GROUP: ${countBy('GROUP')} | DUPLICATE: ${countBy('DUPLICATE')} | NO_COLOR: ${countBy('NO_COLOR')} | REVIEW: ${countBy('REVIEW')}`);
    console.log(`[ProposeVariantGroups] CSV written to ${outputPath}`);
}

if (require.main === module) {
    proposeVariantGroups()
        .catch(error => {
            console.error('[ProposeVariantGroups] Failed:', error);
            process.exitCode = 1;
        })
        .finally(() => prismaClient.$disconnect());
}
