import styled from "styled-components";

export const ColorPickerRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    input[type="color"] {
        width: 64px;
        height: 4rem;
        padding: 4px;
        cursor: pointer;
    }
`;

export const MixedOption = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0.5rem 0 1rem;
    color: var(--text-body);
    font-size: 0.95rem;
    cursor: pointer;
`;
