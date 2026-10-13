import styled, { css } from "styled-components";

export const SwatchList = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
`;

const MIXED_GRADIENT = 'conic-gradient(#C62828, #FDD835, #F48FB1, #1E88E5, #7B1FA2, #C62828)';

export const Swatch = styled.button<{ $hex: string | null; $mixed: boolean; $selected: boolean; $size: number }>`
    position: relative;
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid var(--dt-line-strong);
    background: ${({ $hex, $mixed }) => ($mixed ? MIXED_GRADIENT : $hex || 'var(--dt-neutral-bg)')};
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.15s, box-shadow 0.15s;

    ${({ $selected }) => $selected && css`
        box-shadow: 0 0 0 2px var(--white-background), 0 0 0 4px var(--primary-color);
    `}

    &:hover:not(:disabled) {
        transform: scale(1.1);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.45;

        /* diagonal strike for unavailable colors */
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: -2px;
            right: -2px;
            height: 2px;
            background: var(--dt-ink-soft);
            transform: rotate(-45deg);
        }
    }
`;

export const MoreLabel = styled.span`
    font-size: 0.75rem;
    color: var(--dt-ink-soft);
`;

export const SelectedLabel = styled.span`
    font-size: 0.85rem;
    color: var(--dt-ink-soft);

    strong {
        color: var(--dt-ink);
        font-weight: 600;
    }
`;
