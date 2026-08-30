import { sanitizeRichText, isRichTextEmpty } from "../../utils/sanitizeRichText";
import { RichTextContent } from "./styles";

interface RichTextProps {
    content?: string | null;
    /** Render inline (e.g. right after a label on the same line). */
    inline?: boolean;
    /** Shown when there is no content. Defaults to nothing. */
    fallback?: React.ReactNode;
    className?: string;
}

export function RichText({ content, inline, fallback = null, className }: RichTextProps) {
    if (isRichTextEmpty(content)) {
        return <>{fallback}</>;
    }

    return (
        <RichTextContent
            className={className}
            inline={inline}
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(content) }}
        />
    );
}
