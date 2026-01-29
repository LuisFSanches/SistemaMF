import styled from 'styled-components';

export const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem 0;
`;

export const SwitchActions = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px 0;
`;

export const MultiImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
`;

export const ImageSlot = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const ImageSlotLabel = styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-title);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .badge {
        background: var(--primary-color);
        color: white;
        padding: 0.125rem 0.5rem;
        border-radius: 12px;
        font-size: 0.625rem;
    }
`;

export const ImagePreviewBox = styled.div`
    width: 100%;
    min-height: 150px;
    border: 2px dashed var(--primary-color);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: var(--white-background);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: var(--blue);
        background: #f8f9fa;
    }

    img {
        max-width: 100%;
        max-height: 200px;
        object-fit: contain;
    }
`;

export const UploadLabel = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 1rem;
    color: var(--text-title);
    transition: all 0.2s;

    &:hover {
        color: var(--primary-color);
    }

    svg {
        font-size: 2rem;
    }

    span {
        font-size: 0.875rem;
        text-align: center;
    }
`;

export const HiddenFileInput = styled.input`
    display: none;
`;

export const ImageActions = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.5rem;
`;

export const ImageActionButton = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(0.9);
    }

    &.remove {
        background: var(--red);
        color: var(--text-white);
    }

    &.change {
        background: var(--blue);
        color: var(--text-white);
    }
`;

export const ImageInfo = styled.div`
    font-size: 0.75rem;
    color: var(--text-light);
    text-align: center;
    margin-top: 0.5rem;
`;

export const QRCodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 1rem 0;
`;

export const QRCodeTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-title);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
        color: var(--primary-color);
    }
`;

export const QRCodeImageBox = styled.div`
    background: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 200px;
        max-height: 200px;
        width: 100%;
        height: auto;
        display: block;
    }
`;

export const QRCodeActions = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
`;

export const QRCodeButton = styled.button`
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        filter: brightness(0.9);
        transform: translateY(-1px);
    }

    &.print {
        background: var(--primary-color);
        color: white;
    }

    &.download {
        background: var(--blue);
        color: white;
    }

    svg {
        font-size: 1rem;
    }
`;

export const QRCodeInfo = styled.p`
    font-size: 0.75rem;
    color: var(--text-light);
    text-align: center;
    margin: 0;
`;

export const TabsContainer = styled.div`
    width: 100%;
    margin-bottom: 1rem;
`;

export const TabsList = styled.div`
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid #e9ecef;
    margin-bottom: 1.5rem;
`;

interface TabButtonProps {
    $active: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
    padding: 0.75rem 1.5rem;
    border: none;
    background: transparent;
    color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-light)'};
    font-weight: ${props => props.$active ? '600' : '400'};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;

    &:hover {
        color: var(--primary-color);
    }

    ${props => props.$active && `
        border-bottom-color: var(--primary-color);
    `}
`;

export const TabContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
`;

export const CategoryCheckboxList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
    max-height: 300px;
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
`;

export const CategoryCheckboxItem = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    border: 1px solid #dee2e6;

    &:hover {
        background: #f1f3f5;
        border-color: var(--primary-color);
    }

    input[type="checkbox"] {
        cursor: pointer;
        width: 18px;
        height: 18px;
        margin: 0;
    }

    span {
        font-size: 0.875rem;
        color: var(--text-title);
        user-select: none;
    }
`;

export const SelectedCategoriesPreview = styled.div`
    padding: 1rem;
    background: #e7f5ff;
    border-radius: 8px;
    border: 1px solid #339af0;

    strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-title);
        font-size: 0.875rem;
    }

    .categories-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .category-badge {
        padding: 0.25rem 0.75rem;
        background: var(--primary-color);
        color: white;
        border-radius: 16px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .no-categories {
        color: var(--text-light);
        font-size: 0.875rem;
        font-style: italic;
    }
`;

export const CategoriesInfo = styled.p`
    font-size: 0.75rem;
    color: var(--text-light);
    text-align: center;
    margin: 0.5rem 0 0 0;
`;

export const CategoriesLoadingMessage = styled.div`
    text-align: center;
    padding: 2rem;
    color: var(--text-light);
    font-size: 0.875rem;
`;
