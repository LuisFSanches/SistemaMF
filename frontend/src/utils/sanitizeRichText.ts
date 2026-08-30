import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
    "p", "br", "b", "strong", "i", "em", "u", "s", "ul", "ol", "li", "span"
];

const ALLOWED_ATTR = ["style"];

const ALLOWED_STYLE_PROPS = [
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
    "color"
];

let hookRegistered = false;

function registerStyleHook() {
    if (hookRegistered) {
        return;
    }

    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
        if (!(node instanceof Element)) {
            return;
        }

        const style = node.getAttribute("style");

        if (!style) {
            return;
        }

        const safe = style
            .split(";")
            .map((rule) => rule.trim())
            .filter((rule) => {
                const prop = rule.split(":")[0]?.trim().toLowerCase();
                return prop && ALLOWED_STYLE_PROPS.includes(prop);
            })
            .join("; ");

        if (safe) {
            node.setAttribute("style", safe);
        } else {
            node.removeAttribute("style");
        }
    });

    hookRegistered = true;
}

/**
 * Sanitizes rich-text HTML before rendering it.
 * Legacy plain text passes through untouched.
 */
export const sanitizeRichText = (html?: string | null): string => {
    if (!html) {
        return "";
    }

    registerStyleHook();

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOWED_URI_REGEXP: /^$/
    });
};

/**
 * True when the rich-text value carries no visible content.
 * Covers empty string, empty paragraphs, the legacy "-" placeholder and whitespace.
 */
export const isRichTextEmpty = (html?: string | null): boolean => {
    if (!html) {
        return true;
    }

    const text = html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

    return text === "" || text === "-";
};

/**
 * Strips every tag from rich text, leaving plain text.
 * Use for plain-text destinations (printed receipts, text messages).
 */
export const stripHtml = (html?: string | null): string => {
    if (!html) {
        return "";
    }

    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
};
