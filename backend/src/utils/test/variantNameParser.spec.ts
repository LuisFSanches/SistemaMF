import { describe, it, expect } from 'vitest';
import { parseVariantName } from '../variantNameParser';

describe('parseVariantName', () => {
    it.each([
        ['Buquê de 6 Rosas | Cor: Vermelha', 'Buquê de 6 Rosas', 'Vermelho'],
        ['Buquê de 12 Rosas | Coloridas', 'Buquê de 12 Rosas', 'Sortido'],
        ['Cone 3 Rosas | Rosa ', 'Cone 3 Rosas', 'Rosa'],
        ['Botão de Rosa Rosa', 'Botão de Rosa', 'Rosa'],
        ['Botão de Rosa Chá', 'Botão de Rosa', 'Chá'],
        ['Buquê com 8 rosa chá', 'Buquê com 8 rosa', 'Chá'],
        ['Kalanchoé pote 11 cor Amarelo ', 'Kalanchoé pote 11', 'Amarelo'],
        ['Kalanchoe Pt11 Variado', 'Kalanchoe Pt11', 'Sortido'],
        ['Lirio Rosa (Oriental) Vaso', 'Lirio (Oriental) Vaso', 'Rosa'],
        ['cone com 2 rosas rosa', 'cone com 2 rosas', 'Rosa'],
        ["Ipê Muda 'Ipe' Roxo", "Ipê Muda 'Ipe'", 'Roxo'],
    ])('should parse "%s"', (name, baseName, color) => {
        const parsed = parseVariantName(name);

        expect(parsed.baseName).toBe(baseName);
        expect(parsed.colorName).toBe(color);
    });

    it.each([
        'Buquê de 6 Rosas',
        'Rosa do Deserto Pt11 ',
        'Petalas de Rosa',
        'Mini Rosa Vaso Pt15',
        'Substrato Sumuverde 2kg',
        'Fertilizante Ouro Verde 06.06.08 100ml',
    ])('should not find a color in "%s"', (name) => {
        expect(parseVariantName(name).colorName).toBeNull();
    });

    it('should give the same group key to differently written names of the same product', () => {
        const keys = [
            'Kalanchoe Pt11 | Cor: Branco',
            'Kalanchoé pote 11 cor Laranja ',
            'Kalanchoe Pt11 Variado',
        ].map(name => parseVariantName(name).groupKey);

        expect(new Set(keys).size).toBe(1);

        const coneKeys = [
            'Cone c/ 2 Rosas | Cor: Vermelha',
            'cone com 2 rosas rosa',
            'cone 2 rosas amarelas',
        ].map(name => parseVariantName(name).groupKey);

        expect(new Set(coneKeys).size).toBe(1);

        const rosebudKeys = [
            'Botão de Rosa Unidade | Cor: Vermelha',
            'Botão de Rosa Branca',
        ].map(name => parseVariantName(name).groupKey);

        expect(new Set(rosebudKeys).size).toBe(1);
    });

    it('should keep different sizes in different groups', () => {
        expect(parseVariantName('Buquê de 6 Rosas | Cor: Rosa').groupKey)
            .not.toBe(parseVariantName('Buquê de 8 Rosas | Cor: Rosa').groupKey);
        expect(parseVariantName('Hortencia Rosa Pt15').groupKey)
            .not.toBe(parseVariantName('Hortencia Rosa Pt32').groupKey);
    });
});
