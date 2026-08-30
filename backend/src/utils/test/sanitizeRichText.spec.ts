import { describe, it, expect } from 'vitest';
import { sanitizeRichText, stripHtml } from '../sanitizeRichText';

describe('sanitizeRichText', () => {
    it('keeps allowed formatting tags', () => {
        const input = '<p>Entregar com <strong>urgência</strong> e <em>cuidado</em></p>';
        expect(sanitizeRichText(input)).toBe(input);
    });

    it('removes script tags', () => {
        const result = sanitizeRichText('<p>ok</p><script>alert(1)</script>');
        expect(result).toBe('<p>ok</p>');
    });

    it('strips event handler attributes', () => {
        const result = sanitizeRichText('<p onclick="steal()">texto</p>');
        expect(result).toBe('<p>texto</p>');
    });

    it('drops disallowed tags but keeps their text', () => {
        const result = sanitizeRichText('<div><a href="http://evil">link</a> resto</div>');
        expect(result).toBe('link resto');
    });

    it('keeps only whitelisted style properties', () => {
        const result = sanitizeRichText(
            '<span style="font-size: 18px; position: absolute; background: url(x)">a</span>'
        );
        expect(result).toBe('<span style="font-size: 18px">a</span>');
    });

    it('removes the style attribute entirely when nothing is allowed', () => {
        const result = sanitizeRichText('<span style="position: fixed">a</span>');
        expect(result).toBe('<span>a</span>');
    });

    it('passes plain legacy text through untouched', () => {
        expect(sanitizeRichText('Retirada na loja às 15h')).toBe('Retirada na loja às 15h');
    });

    it('returns null / undefined unchanged', () => {
        expect(sanitizeRichText(null)).toBeNull();
        expect(sanitizeRichText(undefined)).toBeNull();
    });
});

describe('stripHtml', () => {
    it('removes every tag leaving plain text', () => {
        expect(stripHtml('<p>Entregar com <strong>urgência</strong></p>')).toBe(
            'Entregar com urgência'
        );
    });

    it('collapses whitespace and decodes entities', () => {
        expect(stripHtml('<p>a&nbsp;&amp;&nbsp;b</p>')).toBe('a & b');
    });

    it('returns empty string for falsy input', () => {
        expect(stripHtml(null)).toBe('');
        expect(stripHtml('')).toBe('');
    });
});
