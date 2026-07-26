import styled from 'styled-components'

export const Wrap = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
`

export const Track = styled.div`
    width: 84px;
    height: 6px;
    flex: 1;
    border-radius: 999px;
    background: var(--dt-line);
    overflow: hidden;
`

export const Fill = styled.div<{ $percent: number; $danger?: boolean }>`
    height: 100%;
    border-radius: 999px;
    width: ${({ $percent }) => $percent}%;
    background: ${({ $danger }) => ($danger ? 'var(--dt-bad-fg)' : 'var(--dt-accent)')};
`

export const Text = styled.span`
    font-size: 14px;
    color: var(--dt-ink-soft);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
`
