import { sanitizeRichText, isRichTextEmpty, stripHtml } from "./sanitizeRichText";

describe("sanitizeRichText", () => {
    it("keeps allowed formatting tags", () => {
        const input = "<p>Entregar com <strong>urgência</strong></p>";
        expect(sanitizeRichText(input)).toBe(input);
    });

    it("removes script tags", () => {
        expect(sanitizeRichText("<p>ok</p><script>alert(1)</script>")).toBe("<p>ok</p>");
    });

    it("strips event handler attributes", () => {
        expect(sanitizeRichText('<p onclick="x()">t</p>')).toBe("<p>t</p>");
    });

    it("keeps only whitelisted style properties", () => {
        expect(
            sanitizeRichText('<span style="font-size: 18px; position: absolute">a</span>')
        ).toBe('<span style="font-size: 18px">a</span>');
    });

    it("passes legacy plain text through", () => {
        expect(sanitizeRichText("Retirada às 15h")).toBe("Retirada às 15h");
    });

    it("returns empty string for nullish input", () => {
        expect(sanitizeRichText(null)).toBe("");
        expect(sanitizeRichText(undefined)).toBe("");
    });
});

describe("isRichTextEmpty", () => {
    it.each([undefined, null, "", "<p></p>", "  ", "-", "<p>-</p>", "<p><br></p>"])(
        "treats %p as empty",
        (value) => {
            expect(isRichTextEmpty(value as string)).toBe(true);
        }
    );

    it("treats real content as non-empty", () => {
        expect(isRichTextEmpty("<p>oi</p>")).toBe(false);
    });
});

describe("stripHtml", () => {
    it("removes every tag", () => {
        expect(stripHtml("<p>a <strong>b</strong></p>")).toBe("a b");
    });

    it("returns empty string for falsy input", () => {
        expect(stripHtml(null)).toBe("");
    });
});
