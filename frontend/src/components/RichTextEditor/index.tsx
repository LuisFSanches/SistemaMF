import { useEffect, useRef } from "react";
import { useEditor, EditorContent as TiptapEditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FontSize } from "./fontSize";
import { sanitizeRichText } from "../../utils/sanitizeRichText";
import {
    EditorWrapper,
    Toolbar,
    ToolbarButton,
    FontSizeSelect,
    EditorContent
} from "./styles";

// Make the textStyle mark inclusive so the font size keeps applying to text
// typed right after a styled run (spaces in particular were dropping it).
const InclusiveTextStyle = TextStyle.extend({ inclusive: true });

interface RichTextEditorProps {
    value?: string | null;
    onChange: (html: string) => void;
    placeholder?: string;
}

const FONT_SIZES = [
    { label: "Pequeno", value: "12px" },
    { label: "Normal", value: "" },
    { label: "Grande", value: "20px" },
    { label: "Muito grande", value: "26px" }
];

const EMPTY_DOC = "<p></p>";

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    // Last value this component emitted through onChange. Used to tell an
    // external change (form reset, loading another order) apart from an echo
    // of our own typing coming back as a new `value` prop.
    const lastEmitted = useRef<string | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            InclusiveTextStyle,
            FontSize,
            Placeholder.configure({ placeholder: placeholder ?? "Observações" })
        ],
        content: value || "",
        onUpdate: ({ editor: current }) => {
            const html = current.getHTML();
            const next = html === EMPTY_DOC ? "" : sanitizeRichText(html);
            lastEmitted.current = next;
            onChange(next);
        }
    });

    // Push external changes into the editor, but never re-set content just
    // because our own onChange bounced back — that would reset the cursor and
    // swallow the character (notably a space) that triggered the update.
    useEffect(() => {
        if (!editor) {
            return;
        }

        const incoming = value || "";

        if (incoming === lastEmitted.current) {
            return;
        }

        const currentHtml = editor.getHTML();
        const normalizedCurrent = currentHtml === EMPTY_DOC ? "" : currentHtml;

        if (incoming !== normalizedCurrent) {
            editor.commands.setContent(incoming, false);
            lastEmitted.current = incoming;
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const currentFontSize = editor.getAttributes("textStyle").fontSize ?? "";

    const handleFontSize = (size: string) => {
        if (size) {
            editor.chain().focus().setFontSize(size).run();
        } else {
            editor.chain().focus().unsetFontSize().run();
        }
    };

    return (
        <EditorWrapper>
            <Toolbar>
                <ToolbarButton
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Negrito"
                >
                    B
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Itálico"
                    style={{ fontStyle: "italic" }}
                >
                    I
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("underline")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Sublinhado"
                    style={{ textDecoration: "underline" }}
                >
                    U
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("strike")}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Tachado"
                    style={{ textDecoration: "line-through" }}
                >
                    S
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Lista"
                >
                    •
                </ToolbarButton>
                <FontSizeSelect
                    value={currentFontSize}
                    onChange={(event) => handleFontSize(event.target.value)}
                    title="Tamanho da fonte"
                >
                    {FONT_SIZES.map((option) => (
                        <option key={option.label} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </FontSizeSelect>
            </Toolbar>
            <EditorContent>
                <TiptapEditorContent editor={editor} />
            </EditorContent>
        </EditorWrapper>
    );
}
