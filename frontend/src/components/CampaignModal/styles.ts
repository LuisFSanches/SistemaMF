import styled from 'styled-components';

export const HelpText = styled.small`
    display: block;
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
    color: #777;
    font-size: 0.85rem;
`;

export const SectionTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    color: #555;
    margin-top: 0;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f3f4f6;
`;

export const VariableField = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    label {
        flex: 0 0 auto;
        min-width: 48px;
        font-weight: 600;
        font-size: 0.9rem;
        color: #555;
    }

    > input,
    > div {
        flex: 1;
        min-width: 0;
    }
`;

export const AutoVariableBox = styled.div`
    padding: 0.6rem 0.9rem;
    background-color: #f3f4f6;
    border-radius: 0.375rem;
    font-size: 0.85rem;
    color: #666;
`;

export const TemplateCarousel = styled.div`
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding: 0.25rem 0.25rem 0.75rem;
    margin-bottom: 0.5rem;
`;

export const TemplateCard = styled.button<{ selected?: boolean }>`
    flex: 0 0 auto;
    width: 240px;
    border: 2px solid ${({ selected }) => (selected ? '#EC4899' : '#e5e7eb')};
    background: ${({ selected }) => (selected ? '#fdf2f8' : '#fff')};
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s ease;

    &:hover {
        border-color: #EC4899;
    }
`;

export const TemplateCardImage = styled.div`
    width: 100%;
    height: 220px;
    border-radius: 0.375rem;
    overflow: hidden;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.4rem;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    span {
        font-size: 2.5rem;
    }
`;

export const TemplateCardName = styled.div`
    font-size: 0.8rem;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
