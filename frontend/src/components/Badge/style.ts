import styled from 'styled-components'

export type BadgeTone = 'good' | 'warn' | 'bad' | 'neutral' | 'info';

const toneMap: Record<BadgeTone, { bg: string; fg: string }> = {
    good: { bg: 'var(--dt-good-bg)', fg: 'var(--dt-good-fg)' },
    warn: { bg: 'var(--dt-warn-bg)', fg: 'var(--dt-warn-fg)' },
    bad: { bg: 'var(--dt-bad-bg)', fg: 'var(--dt-bad-fg)' },
    neutral: { bg: 'var(--dt-neutral-bg)', fg: 'var(--dt-neutral-fg)' },
    info: { bg: 'var(--dt-info-bg)', fg: 'var(--dt-info-fg)' },
}

export const StyledBadge = styled.span<{ $tone: BadgeTone }>`
    width: stretch;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    font-weight: 700;
    justify-content: center;
    letter-spacing: 0.02em;
    padding: 4px 11px;
    border-radius: 999px;
    text-align: center;
    background: ${({ $tone }) => toneMap[$tone].bg};
    color: ${({ $tone }) => toneMap[$tone].fg};

    &::before {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: currentColor;
    }
`
