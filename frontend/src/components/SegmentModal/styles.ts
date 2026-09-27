import styled from 'styled-components';

export const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

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

    &:first-of-type {
        margin-top: 0;
    }
`;

export const TypeTabs = styled.div`
    display: flex;
    gap: 0.5rem;
    background-color: #f3f4f6;
    padding: 0.25rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
`;

export const TypeTabButton = styled.button<{ active: boolean }>`
    flex: 1;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    ${props => props.active ? `
        background-color: #EC4899;
        color: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        font-weight: bold;
    ` : `
        background-color: transparent;
        color: #555;
    `}
`;

export const FilterBlock = styled.div`
    border: 1px solid #eee;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
`;

export const FilterBlockHeader = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 0;
`;

export const CategoryChecklist = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
    max-height: 160px;
    overflow-y: auto;
`;

export const CategoryChip = styled.label<{ selected: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    font-size: 0.85rem;
    cursor: pointer;
    border: 1px solid ${props => props.selected ? '#EC4899' : '#ddd'};
    background-color: ${props => props.selected ? '#fdeef5' : '#fff'};
    color: ${props => props.selected ? '#EC4899' : '#555'};
`;

export const ClientSearchResults = styled.div`
    border: 1px solid #eee;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    max-height: 180px;
    overflow-y: auto;
`;

export const ClientSearchResultItem = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0.6rem 0.9rem;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
        background-color: #fdeef5;
    }

    &:not(:last-child) {
        border-bottom: 1px solid #f3f4f6;
    }
`;

export const SelectedClientsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
`;

export const SelectedClientItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background-color: #f9f9f9;
    border-radius: 0.375rem;
    font-size: 0.9rem;

    button {
        border: none;
        background: none;
        color: #d33;
        cursor: pointer;
        font-size: 0.85rem;
    }
`;

export const PreviewBox = styled.div`
    background-color: #f9f9f9;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    text-align: center;

    strong {
        font-size: 1.4rem;
        color: #EC4899;
    }
`;
