import styled from "styled-components";

export const EditorWrapper = styled.div`
    border: 1px solid #e7b7c2;
    border-radius: 8px;
    overflow: hidden;

    &:focus-within {
        border-color: #d48a9b;
    }
`;

export const Toolbar = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: nowrap;
    padding: 6px 8px;
    border-bottom: 1px solid #f0d3da;
    background: #fdf6f8;
    overflow-x: auto;
`;

export const ToolbarButton = styled.button.attrs({ type: "button" })<{ active?: boolean }>`
    flex: 0 0 auto;
    min-width: 30px;
    height: 30px;
    padding: 0 8px;
    border: 1px solid ${({ active }) => (active ? "#d48a9b" : "transparent")};
    border-radius: 6px;
    background: ${({ active }) => (active ? "#f5dde4" : "transparent")};
    color: #7a4653;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    line-height: 1;

    &:hover {
        background: #f5dde4;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

export const FontSizeSelect = styled.select`
    flex: 0 0 auto;
    height: 30px;
    max-width: 120px;
    padding: 0 4px;
    margin-left: 4px;
    border: 1px solid #e7b7c2;
    border-radius: 6px;
    background: #fff;
    color: #7a4653;
    font-size: 12px;
    cursor: pointer;
`;

export const EditorContent = styled.div`
    .ProseMirror {
        min-height: 120px;
        padding: 12px;
        font-size: 16px;
        outline: none;
    }

    .ProseMirror p {
        margin: 0;
    }

    .ProseMirror p + p {
        margin-top: 4px;
    }

    .ProseMirror ul,
    .ProseMirror ol {
        margin: 4px 0;
        padding-left: 20px;
    }

    .ProseMirror p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: #b98d99;
        pointer-events: none;
        height: 0;
    }
`;
