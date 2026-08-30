import styled from "styled-components";

export const RichTextContent = styled.div<{ inline?: boolean }>`
    display: ${({ inline }) => (inline ? "inline" : "block")};

    p {
        margin: 0;
    }

    p + p {
        margin-top: 4px;
    }

    ul, ol {
        margin: 4px 0;
        padding-left: 20px;
    }

    strong, b {
        font-weight: 700;
    }

    em, i {
        font-style: italic;
    }

    u {
        text-decoration: underline;
    }

    s {
        text-decoration: line-through;
    }
`;
