import styled from 'styled-components';

export {
    Container,
    SearchContainer,
    SearchButton,
    AddButton,
    EmptyState,
    UnauthorizedMessage
} from '../ParentProducts/style';

export const Tabs = styled.div`
    display: flex;
    gap: 4px;
    margin-top: 1rem;
    border-bottom: 1px solid var(--dt-line);
`;

export const Tab = styled.button<{ $active: boolean }>`
    padding: 0.7rem 1.2rem;
    border: none;
    border-bottom: 3px solid ${({ $active }) => ($active ? 'var(--primary-color)' : 'transparent')};
    background: transparent;
    color: ${({ $active }) => ($active ? 'var(--primary-color)' : 'var(--text-title)')};
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1.5rem;
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2rem;
    background: var(--white-background);
    padding: 1rem 1.2rem;
    border-radius: 0.8rem;
    border: 1px solid #e5e7eb;

    &:hover {
        border-color: var(--primary-color);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

export const RowInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h3 {
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--text-title);
        margin: 0;
    }

    p {
        font-size: 0.85rem;
        color: var(--dt-ink-soft);
        margin: 0;
    }
`;

export const ColorChips = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

export const ColorChip = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px 3px 4px;
    border-radius: 999px;
    background: var(--dt-paper-sunk);
    border: 1px solid var(--dt-line);
    font-size: 0.8rem;
    color: var(--dt-ink);

    &.disabled {
        color: var(--dt-ink-faint);
        text-decoration: line-through;
    }
`;

export const Dot = styled.span<{ $hex: string | null; $mixed: boolean; $size?: number }>`
    width: ${({ $size }) => $size || 16}px;
    height: ${({ $size }) => $size || 16}px;
    border-radius: 50%;
    border: 1px solid var(--dt-line-strong);
    flex-shrink: 0;
    background: ${({ $hex, $mixed }) => ($mixed
        ? 'conic-gradient(#C62828, #FDD835, #F48FB1, #1E88E5, #7B1FA2, #C62828)'
        : $hex || 'var(--dt-neutral-bg)')};
`;

export const Actions = styled.div`
    display: flex;
    gap: 0.5rem;

    button {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.9rem;
        border: none;
        border-radius: 0.4rem;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;

        &.edit {
            background: var(--dt-info-bg);
            color: var(--dt-info-fg);
        }

        &.delete {
            background: var(--dt-bad-bg);
            color: var(--dt-bad-fg);
        }
    }
`;
