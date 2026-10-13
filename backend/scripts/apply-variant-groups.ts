/**
 * Applies a REVIEWED proposal CSV (see propose-variant-groups.ts).
 * DRY RUN by default: validates everything and prints the plan without writing.
 *
 * Usage:
 *   npx ts-node scripts/apply-variant-groups.ts proposal.csv              # dry run
 *   npx ts-node scripts/apply-variant-groups.ts proposal.csv --execute    # writes, in ONE transaction
 *
 * Only rows with action GROUP or DISABLE are applied:
 *   GROUP   -> creates the group (by group_name) if needed and sets the product color
 *   DISABLE -> sets products.enabled = false and store_products.enabled = false (nothing is deleted)
 * With --execute a rollback SQL file is written next to the CSV before any change.
 */
import fs from 'fs';
import path from 'path';
import prismaClient from '../src/prisma';
import { normalizeText } from '../src/utils/variantNameParser';

interface IPlanRow {
    action: string
    group_name: string
    color: string
    product_id: string
    product_name: string
}

function parseCsv(content: string): IPlanRow[] {
    const text = content.replace(/^﻿/, '');
    const records: string[][] = [];
    let field = '';
    let record: string[] = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (inQuotes) {
            if (char === '"' && text[i + 1] === '"') { field += '"'; i++; }
            else if (char === '"') { inQuotes = false; }
            else { field += char; }
        } else if (char === '"') {
            inQuotes = true;
        } else if (char === ';' || char === ',') {
            // Accept both ";" (generated) and "," (re-saved by some spreadsheet apps)
            record.push(field); field = '';
        } else if (char === '\n' || char === '\r') {
            if (char === '\r' && text[i + 1] === '\n') i++;
            record.push(field); field = '';
            if (record.some(value => value.trim() !== '')) records.push(record);
            record = [];
        } else {
            field += char;
        }
    }
    record.push(field);
    if (record.some(value => value.trim() !== '')) records.push(record);

    const [header, ...data] = records;
    const columns = header.map(column => column.trim());

    return data.map(values => {
        const row: any = {};
        columns.forEach((column, index) => { row[column] = (values[index] ?? '').trim(); });
        return row as IPlanRow;
    });
}

const sqlList = (ids: string[]) => ids.map(id => `'${id.replace(/'/g, "''")}'`).join(', ');

async function applyVariantGroups() {
    const csvPath = process.argv[2];
    const execute = process.argv.includes('--execute');

    if (!csvPath) {
        throw new Error('Usage: apply-variant-groups.ts <proposal.csv> [--execute]');
    }

    const rows = parseCsv(fs.readFileSync(path.resolve(csvPath), 'utf8'))
        .map(row => ({ ...row, action: row.action.toUpperCase() }));
    const groupRows = rows.filter(row => row.action === 'GROUP');
    const disableRows = rows.filter(row => row.action === 'DISABLE');

    // ---------- Validation (no writes) ----------
    const errors: string[] = [];

    const colors = await prismaClient.productColor.findMany();
    const colorByName = new Map(colors.map(color => [normalizeText(color.name), color]));

    const productIds = [...new Set([...groupRows, ...disableRows].map(row => row.product_id))];
    const products = await prismaClient.product.findMany({
        where: { id: { in: productIds } },
        select: {
            id: true, name: true, enabled: true, variant_group_id: true,
            variantGroup: { select: { name: true } },
            storeProducts: { select: { id: true, enabled: true } },
        },
    });
    const productById = new Map(products.map(product => [product.id, product]));

    const existingGroups = await prismaClient.productVariantGroup.findMany({
        include: { products: { select: { id: true } } },
    });
    const existingGroupByName = new Map(existingGroups.map(group => [normalizeText(group.name), group]));

    const seenProducts = new Set<string>();
    const plan = new Map<string, Array<{ productId: string; colorId: string; order: number }>>();

    for (const row of [...groupRows, ...disableRows]) {
        const product = productById.get(row.product_id);

        if (!product) {
            errors.push(`Product not found: ${row.product_id} (${row.product_name})`);
            continue;
        }

        if (seenProducts.has(row.product_id)) {
            errors.push(`Product listed more than once: ${product.name}`);
        }
        seenProducts.add(row.product_id);
    }

    for (const row of groupRows) {
        const product = productById.get(row.product_id);
        const color = colorByName.get(normalizeText(row.color));

        if (!row.group_name) {
            errors.push(`Missing group_name for ${row.product_name}`);
            continue;
        }

        if (!color) {
            errors.push(`Unknown color "${row.color}" for ${row.product_name} (create it in the palette first)`);
            continue;
        }

        if (product?.variant_group_id && normalizeText(product.variantGroup?.name || '') !== normalizeText(row.group_name)) {
            errors.push(`${product.name} already belongs to group "${product.variantGroup?.name}"`);
        }

        const members = plan.get(row.group_name) || [];

        if (members.some(member => member.colorId === color.id)) {
            errors.push(`Color "${color.name}" used twice in group "${row.group_name}"`);
        }

        members.push({ productId: row.product_id, colorId: color.id, order: members.length });
        plan.set(row.group_name, members);
    }

    for (const [groupName, members] of plan) {
        const existing = existingGroupByName.get(normalizeText(groupName));
        const planned = new Set(members.map(member => member.productId));
        const extraMembers = existing?.products.filter(product => !planned.has(product.id)) || [];

        if (extraMembers.length > 0) {
            errors.push(`Group "${groupName}" already exists with ${extraMembers.length} product(s) not in the CSV — edit it in the backoffice instead`);
        }
    }

    console.log(`[ApplyVariantGroups] Groups: ${plan.size} | products to group: ${groupRows.length} | products to disable: ${disableRows.length}`);
    for (const [groupName, members] of plan) {
        const colorNames = members.map(member => colors.find(color => color.id === member.colorId)?.name).join(', ');
        console.log(`  - ${groupName}${existingGroupByName.has(normalizeText(groupName)) ? ' (existing)' : ''}: ${colorNames}`);
    }
    for (const row of disableRows) {
        console.log(`  - DISABLE: ${row.product_name}`);
    }

    if (errors.length > 0) {
        console.error(`\n[ApplyVariantGroups] ${errors.length} error(s), nothing was written:`);
        errors.forEach(error => console.error(`  ✗ ${error}`));
        process.exitCode = 1;
        return;
    }

    if (!execute) {
        console.log('\n[ApplyVariantGroups] DRY RUN OK — nothing was written. Re-run with --execute to apply.');
        return;
    }

    // ---------- Rollback file (written before any change) ----------
    const groupedIds = groupRows.map(row => row.product_id);
    const disabledProducts = disableRows.map(row => productById.get(row.product_id)!);
    const newGroupNames = [...plan.keys()].filter(name => !existingGroupByName.has(normalizeText(name)));

    const rollbackPath = path.resolve(path.dirname(csvPath), `rollback-variant-groups-${Date.now()}.sql`);
    const rollbackSql = [
        '-- Rollback generated by apply-variant-groups.ts',
        'BEGIN;',
        groupedIds.length ? `UPDATE "products" SET "variant_group_id" = NULL, "color_id" = NULL, "variant_order" = 0 WHERE "id" IN (${sqlList(groupedIds)});` : '',
        ...disabledProducts.map(product => `UPDATE "products" SET "enabled" = ${product.enabled} WHERE "id" = '${product.id}';`),
        ...disabledProducts.flatMap(product => product.storeProducts.map(sp =>
            `UPDATE "store_products" SET "enabled" = ${sp.enabled} WHERE "id" = '${sp.id}';`
        )),
        newGroupNames.length ? `DELETE FROM "product_variant_groups" WHERE "name" IN (${sqlList(newGroupNames)});` : '',
        'COMMIT;',
    ].filter(Boolean).join('\n');

    fs.writeFileSync(rollbackPath, rollbackSql + '\n', 'utf8');
    console.log(`[ApplyVariantGroups] Rollback SQL written to ${rollbackPath}`);

    // ---------- Apply, all or nothing ----------
    await prismaClient.$transaction(async (tx) => {
        for (const [groupName, members] of plan) {
            const group = existingGroupByName.get(normalizeText(groupName))
                || await tx.productVariantGroup.create({ data: { name: groupName } });

            // Detach first so colors can be swapped without hitting the unique index
            await tx.product.updateMany({
                where: { variant_group_id: group.id },
                data: { variant_group_id: null, color_id: null, variant_order: 0 },
            });

            for (const member of members) {
                await tx.product.update({
                    where: { id: member.productId },
                    data: { variant_group_id: group.id, color_id: member.colorId, variant_order: member.order },
                });
            }
        }

        for (const product of disabledProducts) {
            await tx.product.update({ where: { id: product.id }, data: { enabled: false } });
            await tx.storeProduct.updateMany({ where: { product_id: product.id }, data: { enabled: false } });
        }
    }, { timeout: 60000 });

    console.log('[ApplyVariantGroups] Applied successfully.');
}

applyVariantGroups()
    .catch(error => {
        console.error('[ApplyVariantGroups] Failed (transaction rolled back):', error);
        process.exitCode = 1;
    })
    .finally(() => prismaClient.$disconnect());
