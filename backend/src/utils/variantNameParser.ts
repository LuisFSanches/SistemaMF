// Parses legacy product names ("Buquê de 6 Rosas | Cor: Vermelha", "Botão de Rosa Branca",
// "Kalanchoé pote 11 cor Amarelo") into a base name + color, used by the variant migration scripts.

export interface IParsedVariantName {
    baseName: string        // human readable base, e.g. "Buquê de 6 Rosas"
    groupKey: string        // normalized key used to match products of the same group
    colorName: string | null // palette color name, e.g. "Vermelho"
    colorTokens: string[]   // every color word found (more than one => needs review)
}

// Word (normalized, without accents) -> palette color name
const COLOR_WORDS: Array<{ pattern: RegExp; color: string }> = [
    { pattern: /^vermelh(o|a|os|as)$/, color: 'Vermelho' },
    { pattern: /^rosas?$/, color: 'Rosa' },
    { pattern: /^pink$/, color: 'Pink' },
    { pattern: /^branc(o|a|os|as)$/, color: 'Branco' },
    { pattern: /^amarel(o|a|os|as)$/, color: 'Amarelo' },
    { pattern: /^laranjas?$/, color: 'Laranja' },
    { pattern: /^chas?$/, color: 'Chá' },
    { pattern: /^(azul|azuis)$/, color: 'Azul' },
    { pattern: /^rox(o|a|os|as)$/, color: 'Roxo' },
    { pattern: /^lilas$/, color: 'Lilás' },
    { pattern: /^(variad|colorid|mist|sortid)(o|a|os|as)$/, color: 'Sortido' },
];

// Words ignored when building the group key
const KEY_STOPWORDS = new Set(['de', 'do', 'da', 'com', 'c', 'cor', 'e', 'unidade', 'un']);

export function normalizeText(text: string) {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();
}

function colorFromWord(word: string) {
    const normalized = normalizeText(word).replace(/[^a-z]/g, '');
    return COLOR_WORDS.find(entry => entry.pattern.test(normalized))?.color ?? null;
}

// "rosa" is both a flower and a color: only treat it as a color when it qualifies something,
// e.g. "Botão de Rosa Rosa", "moca de astromélia rosa" — not "Buquê de 6 Rosas", "Rosa do Deserto", "Petalas de Rosa".
function isRoseFlower(words: string[], index: number) {
    const normalized = normalizeText(words[index]).replace(/[^a-z]/g, '');

    if (!/^rosas?$/.test(normalized)) {
        return false;
    }

    const previous = index > 0 ? normalizeText(words[index - 1]) : '';
    const next = index < words.length - 1 ? normalizeText(words[index + 1]) : '';

    return index === 0
        || /^\d+$/.test(previous)
        || ['de', 'c/', 'com', 'mini'].includes(previous)
        || ['do', 'de', 'eterna', 'avulsa', 'infinita', 'falsa', 'import.', 'unidade', 'spray'].includes(next);
}

function buildGroupKey(baseName: string) {
    const tokens = normalizeText(baseName)
        .replace(/\bpote\s*(\d+)/g, 'pt$1')
        .replace(/\bpt\s+(\d+)/g, 'pt$1')
        .replace(/\bpt0+(\d)/g, 'pt$1')
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token && !KEY_STOPWORDS.has(token))
        // naive singular: "rosas" -> "rosa", "mudas" -> "muda"
        .map(token => (token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token));

    // Word order does not matter: "Astromélia Moca Amarela" == "moca de astromélia branca"
    return [...new Set(tokens)].sort().join(' ');
}

function cleanBaseName(text: string) {
    return text
        .replace(/\s*\|\s*$/, '')
        .replace(/\s+cor\s*$/i, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

export function parseVariantName(name: string): IParsedVariantName {
    const trimmed = name.replace(/\s{2,}/g, ' ').trim();

    // 1. Explicit convention: "<base> | Cor: <color>" or "<base> | <color>"
    const pipeMatch = trimmed.match(/^(.*?)\s*\|\s*(?:cor\s*:\s*)?(.+)$/i);
    if (pipeMatch) {
        const suffixColors = pipeMatch[2].split(/\s+/).map(colorFromWord).filter(Boolean) as string[];

        if (suffixColors.length > 0) {
            const baseName = cleanBaseName(pipeMatch[1]);
            return {
                baseName,
                groupKey: buildGroupKey(baseName),
                colorName: suffixColors[suffixColors.length - 1],
                colorTokens: suffixColors,
            };
        }
    }

    // 2. Free text: the color is the last color word that is not the "rosa" flower
    const words = trimmed.split(' ');
    const colorIndexes = words
        .map((word, index) => ({ index, color: colorFromWord(word) }))
        .filter(entry => entry.color && !isRoseFlower(words, entry.index));

    if (colorIndexes.length === 0) {
        const baseName = cleanBaseName(trimmed);
        return { baseName, groupKey: buildGroupKey(baseName), colorName: null, colorTokens: [] };
    }

    const last = colorIndexes[colorIndexes.length - 1];
    const baseName = cleanBaseName(words.filter((_, index) => index !== last.index).join(' '));

    return {
        baseName,
        groupKey: buildGroupKey(baseName),
        colorName: last.color,
        colorTokens: colorIndexes.map(entry => entry.color as string),
    };
}
