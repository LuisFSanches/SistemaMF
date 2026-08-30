import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
    'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'ul', 'ol', 'li', 'span'
];

const ALLOWED_ATTR = ['style'];

const ALLOWED_STYLE_PROPS = [
    'font-size',
    'font-weight',
    'font-style',
    'text-decoration',
    'color'
];

let hookRegistered = false;

function registerStyleHook() {
    if (hookRegistered) {
        return;
    }

    DOMPurify.addHook('afterSanitizeAttributes', (node: Element) => {
        const style = node.getAttribute('style');

        if (!style) {
            return;
        }

        const safe = style
            .split(';')
            .map((rule) => rule.trim())
            .filter((rule) => {
                const prop = rule.split(':')[0]?.trim().toLowerCase();
                return prop && ALLOWED_STYLE_PROPS.includes(prop);
            })
            .join('; ');

        if (safe) {
            node.setAttribute('style', safe);
        } else {
            node.removeAttribute('style');
        }
    });

    hookRegistered = true;
}

/**
 * Sanitizes user-provided rich text (HTML) before persisting it.
 * Keeps only a minimal formatting allowlist; plain text passes through untouched.
 */
export const sanitizeRichText = (html?: string | null): string | null => {
    if (html === undefined || html === null) {
        return html ?? null;
    }

    registerStyleHook();

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOWED_URI_REGEXP: /^$/
    });
};

/**
 * Strips every tag from rich text, leaving plain text.
 * Use for plain-text destinations such as WhatsApp messages.
 */
export const stripHtml = (html?: string | null): string => {
    if (!html) {
        return '';
    }

    const withoutTags = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    return withoutTags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
};
