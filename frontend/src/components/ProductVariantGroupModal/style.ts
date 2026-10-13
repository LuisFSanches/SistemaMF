import styled from "styled-components";

export const SectionTitle = styled.h3`
    font-size: 1rem;
    color: var(--text-title);
    margin: 1rem 0 0.5rem;
`;

export const Hint = styled.p`
    font-size: 0.85rem;
    color: var(--dt-ink-soft);
    margin-bottom: 0.75rem;
`;

export const VariantList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const VariantRow = styled.div`
    display: grid;
    grid-template-columns: 48px 1fr 160px 36px;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border: 1px solid var(--dt-line);
    border-radius: 0.5rem;
    background: var(--dt-paper);

    img {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 0.4rem;
    }

    span {
        font-size: 0.9rem;
        color: var(--text-body);
        overflow-wrap: anywhere;
    }

    select {
        margin-bottom: 0;
    }

    @media (max-width: 600px) {
        grid-template-columns: 40px 1fr 36px;

        select {
            grid-column: 2 / 3;
        }
    }
`;

export const IconButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 0.4rem;
    border: none;
    background: var(--dt-bad-bg);
    color: var(--dt-bad-fg);
    cursor: pointer;
`;

export const SearchRow = styled.div`
    display: flex;
    gap: 8px;

    input {
        flex: 1;
        margin-bottom: 0;
    }

    button {
        padding: 0 1.2rem;
        border: none;
        border-radius: 0.4rem;
        background: var(--primary-color);
        color: #fff;
        font-weight: 600;
        cursor: pointer;
    }
`;

export const SearchResults = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 220px;
    overflow-y: auto;
    margin-top: 8px;
    border: 1px solid var(--dt-line);
    border-radius: 0.5rem;

    &:empty {
        display: none;
    }
`;

export const SearchResult = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: none;
    border-bottom: 1px solid var(--dt-line);
    background: var(--white-background);
    text-align: left;
    font-size: 0.9rem;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover:not(:disabled) {
        background: var(--dt-accent-wash);
    }

    &:disabled {
        cursor: not-allowed;
        color: var(--dt-ink-faint);
    }

    small {
        color: var(--dt-ink-soft);
        white-space: nowrap;
    }
`;

export const EmptyVariants = styled.div`
    padding: 16px;
    text-align: center;
    color: var(--dt-ink-soft);
    border: 1px dashed var(--dt-line-strong);
    border-radius: 0.5rem;
    font-size: 0.9rem;
`;
